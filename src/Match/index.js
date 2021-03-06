import React from 'react';
import { Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './index.css';
import getCounter from '../Lobby/getCounter.js';

const useStyles = makeStyles({
    gameInfo: {
        display: 'flex',
        width: '100%',
        marginBottom: 20,
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        backgroundColor: 'black',
        borderBottom: '1px solid #ffffff1f',
        zIndex: 100,
        '& div': {
            flexGrow: 1,
        },
    },

    gameInfoTitle: {
        textAlign: 'center',
    },

    gameInfoContent: {
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center',
        /*textAlign: 'center',
        '& *': {
            display: 'inline',
        },*/
    },

    title: {
        textAlign: 'center',
    },

    colourIndicator: {
        height: 49,
    },

    playerArea: {
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 16,
        textAlign: 'center',
        border: '1px solid #ffffff1f',
        borderRadius: 10,
    },

    selfGameImage: {
        maxWidth: 125,
        maxHeight: 125,
        width: 'auto',
        height: 'auto',
    },

    otherGameImage: {
        maxWidth: 100,
        maxHeight: 100,
        width: 'auto',
        height: 'auto',
    },

    playingGamesContainer: {
    },

    playingGames: {
        display: 'flex',
        maxWidth: 600,
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },

    otherGamesContainer: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },

    otherGames: {
        display: 'flex',
        maxWidth: 600,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },

    vsMe: {
        color: 'red',
    }
});

function GameImage(props) {
    const classes = useStyles();
    let colour = Object.keys(props.game.playerIDs).find(c => props.playerId.startsWith(props.game.playerIDs[c]));
    let opponent = props.players.find(player => player.id.startsWith(props.game.playerIDs[colour == 'a' ? 'b' : 'a']));// props.players.find(player => player.id.startsWith(Object.values(props.game.playerIDs).find(player => !props.playerId.startsWith(player))));

    return (
        <div>
            <img data-playercolour={props.playerColour} className={`${props.self ? 'self-game ' : ''}${props.self ? classes.selfGameImage : classes.otherGameImage} ${props.self && props.games.length == 1 && props.playerColour == 'b' ? 'game-b' : `game-${colour}`} game${props.game.id}`} />
            <Typography variant="caption" display="block">
                Game {props.game.name} vs {props.myId.startsWith(opponent.id) ? <span className={classes.vsMe}>{opponent.name}</span> : opponent.name}
            </Typography>
        </div>
    );
}

const turnTakenIndicatorSize = 13;
function TurnTakenIndicator(props) {
    return (
        <svg height={props.size} width={props.size}>
            <circle id={`playerTurnIndicator-${props.player}`} cx={props.size/2} cy={props.size/2} r={props.size/2} fill="red" />
        </svg>
    );
}

function PlayerGames(props) {
    const classes = useStyles();
    let gameRowClass = props.self ? classes.playingGames : classes.otherGames;

    return (
        <div className={classes.playerArea}>
            {
                props.self
                ?
                <div>
                    <Typography variant="h4">{props.player.name} <TurnTakenIndicator size={23} player={props.player.id.slice(0, 6)} /></Typography>
                    <Divider />
                </div>
                :
                <Typography variant="h6" gutterBottom>{props.player.name} <TurnTakenIndicator size={14} player={props.player.id} /></Typography>
            }
            <div className={props.self ? classes.playingGamesContainer : classes.otherGamesContainer}>
                <div className={gameRowClass}>
                    {props.self ? <img className={`${classes.colourIndicator} colour-indicator-a`} src={`/counters/${getCounter('a', props.player.cosmetics)}.png`} /> : null}
                    {props.games.filter(game => props.player.id.startsWith(game.playerIDs.a)).map(game => <GameImage self={props.self} game={game} games={props.games} players={props.players} playerColour={'a'} playerId={props.player.id} myId={props.myId} />)}
                    {props.self ? null : <img className={`${classes.colourIndicator} colour-indicator-a`} src={`/counters/${getCounter('a', props.player.cosmetics)}.png`} />}
                </div>
                {props.self ? <div id="controller" className={classes.controls} /> : null}
                <div className={gameRowClass}>
                    <img className={`${classes.colourIndicator} colour-indicator-b`} src={`/counters/${getCounter('b', props.player.cosmetics)}.png`} />
                    {props.games.filter(game => props.player.id.startsWith(game.playerIDs.b)).map(game => <GameImage self={props.self} game={game} games={props.games} players={props.players} playerColour={'b'} playerId={props.player.id} myId={props.myId} />)}
                </div>
            </div>
        </div>
    );
}

function Match(props) {
    const classes = useStyles();
    let selfPlayer = props.players.find(player => props.myId.startsWith(player.id));

    return (
        <div>
            <div className={classes.gameInfo}>
                <div>
                    <div className={classes.gameInfoTitle}>
                        <Typography variant="subtitle1">
                            Ongoing games
                        </Typography>
                    </div>
                    <div className={classes.gameInfoContent}>
                        <Typography variant="h3">
                            <span id="gamesLeft">0</span>
                        </Typography>
                        <Typography variant="h5">
                            /<span id="maxGames">0</span>
                        </Typography>
                    </div>
                </div>

                <div>
                    <div className={classes.gameInfoTitle}>
                        <Typography variant="subtitle1">
                            Turn time left
                        </Typography>
                    </div>
                    <div className={classes.gameInfoContent}>
                        <Typography variant="h3">
                            <span id="turnTime">0</span>
                        </Typography>
                    </div>
                </div>

                <div>
                    <div className={classes.gameInfoTitle}>
                        <Typography variant="subtitle1">
                            Turn
                        </Typography>
                    </div>
                    <div className={classes.gameInfoContent}>
                        <Typography variant="h3">
                            <img height="35" id="turnIndicator" />
                            <span id="turnNumber">0</span>
                        </Typography>
                    </div>
                </div>
            </div>

            <div>
                <Typography variant="h2" style={{textAlign: 'center'}}>{props.games.filter(game => props.players[0].id.startsWith(game.playerIDs.a)).length+props.games.filter(game => props.players[0].id.startsWith(game.playerIDs.b)).length}connect{props.matchInfo.options.lineLength}</Typography>
                <PlayerGames player={selfPlayer} players={props.players} games={props.games} self={true} myId={props.myId} />
                {props.players.filter(player => !props.myId.startsWith(player.id)).map(player => (
                    <PlayerGames player={player} players={props.players} games={props.games} self={false} myId={props.myId} />
                ))}
            </div>
        </div>
    );
}

export default Match;