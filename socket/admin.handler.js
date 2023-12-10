var express = require('express');

let io;
const adminSockets = {};

module.exports = {
    init: (IO) => {
        io = IO;
        io.on('connection', (socket) => {
            const session = socket.request.session;
            if (!session || !session.user) {
                console.log('No session or user data, disconnecting socket');
                socket.emit(
                    'auth',
                    'You are not authorized to connect. Disconnecting.',
                );
                socket.disconnect(true);
            } else if (
                !session.user.role.isAdmin ||
                !session.user.role.shopId
            ) {
                console.log('User is not admin, disconnecting socket');
                socket.emit('auth', 'User is not admin');
                socket.disconnect(true);
            } else {
                console.log('A user connected', session);
                adminSockets[session.user.role.shopId] = socket.id;

                socket.on('disconnect', () => {
                    console.log('User disconnected');
                });
            }
        });
        return io;
    },
    getAdminIo: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    },
    getAdminSockets: () => {
        return adminSockets;
    },
};
