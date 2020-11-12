import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CodeInput from './CodeInput';
import NameInput from './NameInput';
import socket from '../socket';

const useStyles = makeStyles({
    title: {
        textAlign: 'center',
    },

    controls: {
        textAlign: 'center',
        border: '1px solid #0000001f',
        borderRadius: 10,
    },
});

function Home() {
    const classes = useStyles();

    return (
        <div>
            <Typography className={classes.title} variant="h1" gutterBottom>8connect4</Typography>

            <Typography variant="body1" gutterBottom>
                Play 8 games of connect 4 at once.
            </Typography>

            <div className={classes.controls}>
                <NameInput />

                <Divider />
                <br />

                <Button variant="contained" size="large" color="primary" onClick={() => socket.emit('findMatch')}>Find Match</Button>
                <br />
                <Button variant="contained" size="large" color="secondary" onClick={() => socket.emit('createMatch')}>Create Private Match</Button>

                <br /><br /><br />

                <CodeInput />
            </div>
        </div>
    );
}

export default Home;