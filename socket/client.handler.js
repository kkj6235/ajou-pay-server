var express = require('express');

let io;
const userSockets = {};

module.exports = {
    init: (IO) => {
        io = IO;
        io.on('connection', (socket) => {
            const session = socket.request.session;
            if (!session || !session.user) {
                console.log('No session or user data, disconnecting socket');
                socket.emit(
                    'no-session',
                    'You are not authorized to connect. Disconnecting.',
                );
                socket.disconnect(true);
            } else {
                console.log('A user connected', session);

                userSockets[session.user._id] = socket.id;

                socket.on('disconnect', () => {
                    console.log('User disconnected');
                });
            }
        });
        return io;
    },
    getIo: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    },
    getUserSockets: () => {
        return userSockets;
    },
};
