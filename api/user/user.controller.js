var mongoose = require('mongoose');
var User = mongoose.model('User');
let crypto = require('crypto');
const { log } = require('console');
require('dotenv').config({ path: '../../.env' });

const postLogin = async (req, res) => {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
        return res
            .status(400)
            .json({ message: 'Login ID and password are required.' });
    }
    if (req.session.user) {
        console.log(req.session.user);
        res.status(200).json({ message: 'Already logged in' });
    } else {
        const user = await User.findOne({ loginId: loginId });

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        const match = await user.compare(password, user.password);

        if (match) {
            req.session.user = user;
            res.status(200).json(user);
        } else {
            res.status(401).json({ message: 'Incorrect password.' });
        }
    }
};
const postRegister = async (req, res) => {
    const data = req.body;

    const fields = ['loginId', 'name', 'password', 'phone', 'email'];
    for (const field of fields) {
        if (!data[field]) {
            return res.status(400).json({ message: `${field} is required.` });
        }
    }

    const existingUser = await User.findOne({ loginId: data['loginId'] });

    if (existingUser) {
        return res.status(400).json({ message: 'Login ID is already taken.' });
    }

    try {
        const hashedPassword = crypto
            .createHmac('sha256', process.env.SECRET_KEY)
            .update(data['password'])
            .digest('hex');

        const user = new User({
            loginId: data['loginId'],
            name: data['name'],
            password: hashedPassword,
            phone: data['phone'],
            email: data['email'],
            created_date: new Date().getTime(),
        });

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getLogout = (req, res) => {
    if (req.session.user) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({
                    message: 'Error while destroying session.',
                });
                return;
            }
            res.status(200).json({ message: 'Logout successful.' });
        });
    } else {
        res.status(401).json({ message: 'Not logged in.' });
    }
};
const updateUser = async (req, res) => {
    if (req.session.user) {
        const data = req.body;
        let id = req.param;
        const user = await User.findOneAndUpdate(
            { loginId: id },
            {
                name: data['name'],
                password: data['password'],
                phone: data['phone'],
                email: data['email'],
            },
            { new: true },
        );

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        req.session.user = user;
        res.status(200).json(user);
    } else {
        res.status(401).json({ message: 'Unauthorized: Not logged in.' });
    }
};

module.exports = { postLogin, getLogout, postRegister, updateUser };
