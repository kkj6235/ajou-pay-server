var mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        loginId: String,
        name: String,
        password: String,
        phone: String,
        email: String,
        createdDate: Date,
        status: {
            type: Boolean,
            default: true,
        },
    },
    { versionKey: false },
);

mongoose.model('User', userSchema);
