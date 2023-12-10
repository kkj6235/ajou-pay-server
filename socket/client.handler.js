var express = require('express');

let io;
const userSockets = {};
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
            } else {
                if (session.user.role.isAdmin || session.user.role.shopId) {
                    // ADMIN CASE
                    console.log('SOCKET ADMIN CASE');
                    console.log('A user connected', session);
                    adminSockets[session.user.role.shopId] = socket.id;
                } else {
                    // USER CASE
                    console.log('SOCKET USER CASE');
                    console.log('A user connected', session);
                    userSockets[session.user._id] = socket.id;
                }

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
    getAdminSockets: () => {
        return adminSockets;
    },
};
