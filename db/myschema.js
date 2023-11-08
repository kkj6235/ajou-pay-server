const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
    {
        name: String,
        price: Number,
        image: {
            type: String,
            default: null,
        },
        soldout: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false },
);
const storeSchema = new mongoose.Schema(
    {
        _id: Number,
        name: String,
        openStatus: {
            type: Number,
            default: true,
        },
        waitingOrderCount: {
            type: Number,
            default: 0,
        },
    },
    { versionKey: false },
);

const userSchema = new mongoose.Schema(
    {
        login_id: String,
        name: String,
        password: String,
        phone: String,
        email: String,
        created_date: Date,
        status: {
            type: Boolean,
            default: true,
        },
    },
    { versionKey: false },
);
const submenu = new mongoose.Schema(
    {
        menu_id: String,
        quantity: Number,
    },
    { versionKey: false, _id: false },
);
const orderSchema = new mongoose.Schema(
    {
        user_id: String,
        store_id: Number,
        payment_method: String,
        total_price: Number,
        created_time: Date,
        takeout: Boolean,
        menuField: [submenu],
        waitingCount: Number,
    },
    { versionKey: false },
);

module.exports = { menuSchema, storeSchema, userSchema, orderSchema };
