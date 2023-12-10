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

const {
    getIo,
    getUserSockets,
    getAdminSockets,
} = require('../../socket/client.handler');
const io = getIo();
const userSockets = getUserSockets();
const adminSockets = getAdminSockets();

orderSchema.post('save', (order) => {
    console.log('ORDER SAVEED: ', order, adminSockets, userSockets);
    if (adminSockets[order.shopId]) {
        const socketId = adminSockets[order.shopId];
        io.to(socketId).emit('order', order);
    }

    const userId = order.userId;
    if (userSockets[userId]) {
        const socketId = userSockets[userId];
        io.to(socketId).emit('order', order);
    }
});

mongoose.model('Order', orderSchema);
