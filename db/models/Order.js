var mongoose = require('mongoose');

const submenu = new mongoose.Schema(
    {
        menuId: String,
        quantity: Number,
    },
    { versionKey: false, _id: false },
);

const orderSchema = new mongoose.Schema(
    {
        userId: String,
        shopId: Number,
        items: [submenu],
        paymentMethod: String,
        waitingCount: Number,
        takeout: Boolean,
        totalPrice: Number,
        createdTime: Date,
        status: String,
    },
    { versionKey: false },
);

const { getClientIo, getUserSockets } = require('../../socket/client.handler');
const io_client = getClientIo();
const userSockets = getUserSockets();

const { getAdminIo, getAdminSockets } = require('../../socket/admin.handler');
const io_admin = getAdminIo();
const adminSockets = getAdminSockets();

orderSchema.post('save', (order) => {
    if (adminSockets[order.shopId]) {
        const socketId = adminSockets[order.shopId];
        io_admin.to(socketId).emit('order-created', order);
    }

    const userId = order.userId;
    if (userSockets[userId]) {
        const socketId = userSockets[userId];
        io_client.to(socketId).emit('order', order);
    }
});

mongoose.model('Order', orderSchema);
