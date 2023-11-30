var mongoose = require('mongoose');
let crypto = require('crypto');
require('dotenv').config({ path: '../../.env' });


const roleSchema = new mongoose.Schema(
    {
        isAdmin: {type : Boolean, default: false},
        shopId: { type: mongoose.Schema.Types.Number, ref: 'Store'},
    },
    { versionKey: false, _id: false },
);

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
        role: roleSchema ,
    },
    { versionKey: false },
);

userSchema.methods.compare = async function (password, userPassword) {
    const hashedPassword = crypto
        .createHmac('sha256', process.env.SECRET_KEY)
        .update(password)
        .digest('hex');
    return userPassword === hashedPassword;
};

mongoose.model('User', userSchema);
