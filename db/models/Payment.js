var mongoose = require('mongoose');

const submenu = new mongoose.Schema(
    {
        menuId: String,
        quantity: Number,
    },
    { versionKey: false, _id: false },
);

const paymentSchema = new mongoose.Schema(
    {
        tid: String,
        userId: String,
        shopId: Number,
        items: [submenu],
        takeout: Boolean,
        totalPrice: Number,
        waitingCount: Number,
        approved: Boolean,
    },
    { versionKey: false },
);

mongoose.model('Payment', paymentSchema);
