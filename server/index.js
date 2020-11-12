const cfg = require('./cfg');
const maxUsernameLength = 12;
const allowedUsernameChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 áéíóúÁÉÍÓÚ!"£$€%^&*()-=_+[]{};\'#:@~,./<>?\\|`¬¦';
const numberOfPlayers = 9;

const codeLength = 6;
const codeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const io = require("socket.io")(cfg.port, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

function generateUsername(socket) {
    socket.username = `player${String(Math.random()).slice(2, 2+3)}`;
}

function joinMatch(match, socket) {
    if (socket.ingame)
        return;
    if (Object.keys(match.players).length >= numberOfPlayers)
        return;
    match.join(socket.id);
    socket.join(match.code);
    socket.emit('joinMatch');
    socket.ingame = match.code;
}

function createMatch(socket, public) {
    if (socket.ingame)
        return;
    let match = new Match(public);
    let code = generateMatchCode();
    matches[code] = match;
    match.code = code;
    joinMatch(match, socket);
}

io.on('connection', socket => {
    generateUsername(socket)
    socket.ingame = false;

    socket.on('changeName', newName => {
        if (typeof newName == 'string') {
            let usernameAllowed = true;
            for (let i of newName)
                if (!allowedUsernameChars.includes(i))
                    usernameAllowed = false;
                
            if (usernameAllowed && newName.length > 0 && newName.length <= maxUsernameLength)
                socket.username = newName;
            else
                generateUsername(socket)
        }
        
    });

    socket.on('joinMatch', code => {
        if (matches.hasOwnProperty(code)) {
            let match = matches[code];
            if (!match.started);
                joinMatch(match, socket);
        }
    });

    socket.on('findMatch', () => {
        let match = Object.values(matches).find(e => e.isPublic && !e.started);
        if (match == undefined) //if there are no available matches
            createMatch(socket, true);
        else
            joinMatch(match, socket);
    });

    socket.on('createMatch', () => createMatch(socket, false));

    socket.on('move', (colour, column) => {
        if (socket.ingame && typeof colour == 'string' && typeof column == 'number') {
            let match = matches[socket.ingame];
            if (match && match.allowMoves)
                if (match.move(socket.id, colour, column))
                    socket.emit('takenTurn', match.turn);
        }
    });

    socket.on('hover', column => {
        if (socket.ingame && typeof column == 'number') {
            let match = matches[socket.ingame];
            if (match && match.allowMoves)
                match.hover(socket.id, column);
        }
    })

    socket.on('disconnect', () => {
        if (socket.ingame && matches[socket.ingame])
            matches[socket.ingame].leave(socket.id);
    });
});

function generateMatchCode() {
    let code;
    do {
        code = '';
        for (let i = 0; i < codeLength; i++)
            code += codeChars[Math.floor(Math.random()*codeChars.length)];
    } while (matches.hasOwnProperty(code))
    return code;
}

var matches = {};

module.exports = {
    io,
    matches
};

const Match = require('./Match');

console.log(`Server up, port ${cfg.port}`);