var mongoose = require('mongoose');
const axios = require('axios');
const Order = mongoose.model('Order');

const getAdminOrders = async (req, res) => {
    if (!req.session.user) {
        return res
            .status(401)
            .send({ message: 'Unauthorized: No session found' });
    }

    const user = req.session.user;
    console.log(user);

    if (!user.role.isAdmin || !user.role.shopId) {
        return res
            .status(403)
            .send({ message: 'Forbidden: Not an admin or shopId missing' });
    }

    try {
        const orders = await Order.find({ shopId: user.role.shopId });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error occurred' });
    }
};

module.exports = { getAdminOrders };
