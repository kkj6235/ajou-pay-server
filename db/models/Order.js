var mongoose = require('mongoose');

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
    },
    { versionKey: false },
);

mongoose.model('Order', orderSchema);
