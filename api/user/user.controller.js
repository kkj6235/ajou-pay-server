var mongoose = require('mongoose');
var User = mongoose.model('User');
let crypto = require('crypto');
require('dotenv').config({ path: '../../.env' });

const postLogin = async (req, res) => {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
        return res
            .status(400)
            .json({ message: 'Login ID and password are required.' });
    }
    if (req.session.user) {
        return res.status(200).json({ message: 'Already logged in' });
    }
    else {
        try {
            const user = await User.findOne({ loginId: loginId });

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const match = await user.compare(password, user.password);

            if (match) {
                req.session.user = user;
                return res.status(200).json({
                    createdDate: user.createdDate,
                    email: user.email,
                    loginId: user.loginId,
                    name: user.name,
                    phone: user.phone,
                    status: user.status,
                    _id: user._id,
                    role: user.role,
                });
            } else {
                return res.status(401).json({ message: 'Incorrect password.' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
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

    try {
        const existingUser = await User.findOne({ loginId: data['loginId'] });

        if (existingUser) {
            return res.status(400).json({ message: 'Login ID is already taken.' });
        }
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
            createdDate: new Date().getTime(),
            role: {
                isAdmin: false,
            }
        });

        await user.save();

        return res.status(200).json({
            createdDate: user.createdDate,
            email: user.email,
            loginId: user.loginId,
            name: user.name,
            phone: user.phone,
            status: user.status,
            _id: user._id,
            role: user.role,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getLogout = (req, res) => {
    if (req.session.user) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error while destroying session:', err);
                    return res.status(500).json({
                        message: 'Error while destroying session.',
                    });
                }
                return res.status(200).json({ message: 'Logout successful.' });
            });
        } catch (error) {
            console.error('Error during logout:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(401).json({ message: 'Not logged in.' });
    }
};



const updateUser = async (req, res) => {
    try {
        if (req.session.user) {
            const data = req.body;
            let id = req.params.userId;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: 'Invalid user ID.' });
            }

            const fields = ['name', 'password', 'phone', 'email'];
            for (const field of fields) {
                if (!data[field]) {
                    return res.status(400).json({ message: `${field} is required.` });
                }
            }
            const hashedPassword = crypto
                .createHmac('sha256', process.env.SECRET_KEY)
                .update(data['password'])
                .digest('hex');

            const user = await User.findOneAndUpdate(
                { _id: id },
                {
                    name: data['name'],
                    password: hashedPassword,
                    phone: data['phone'],
                    email: data['email'],
                },
                { new: true },
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            req.session.user = user;
            return res.status(200).json({
                createdDate: user.createdDate,
                email: user.email,
                loginId: user.loginId,
                name: user.name,
                phone: user.phone,
                status: user.status,
                _id: user._id,
                role: user.role,
            });
        } else {
            return res.status(401).json({ message: 'Unauthorized: Not logged in.' });
        }
    } catch (error) {
        console.error('Error during user update:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = { postLogin, getLogout, postRegister, updateUser };
