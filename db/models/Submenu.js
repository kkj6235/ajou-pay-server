var mongoose = require('mongoose');

const submenu = new mongoose.Schema(
    {
        menuId: String,
        quantity: Number,
    },
    { versionKey: false, _id: false },
);

mongoose.model('Submenu', submenu);
