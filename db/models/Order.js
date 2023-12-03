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

const { getIo, getUserSockets } = require('../../socket/client.handler');
const io = getIo();
const userSockets = getUserSockets();

orderSchema.post('save', (order) => {
    //console.log(userSockets);
    const userId = order.userId;
    if (userSockets[userId]) {
        const socketId = userSockets[userId];
        io.to(socketId).emit('order-status-updated', order);
    }
});

mongoose.model('Order', orderSchema);
