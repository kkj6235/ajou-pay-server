var mongoose = require('mongoose');
const axios = require('axios');
const Order = mongoose.model('Order');

const updateOrderStatus = async (req, res) => {
    if (!req.session.user) {
        return res
            .status(401)
            .send({ message: 'Unauthorized: No session found' });
    }

    const user = req.session.user;

    if (!user.role.isAdmin || !user.role.shopId) {
        return res
            .status(403)
            .send({ message: 'Forbidden: Not an admin or shopId missing' });
    }

    const { orderId, newStatus } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Completed'];

    if (!validStatuses.includes(newStatus)) {
        return res.status(400).send({
            message:
                'Invalid status. Must be one of Pending, Preparing, or Ready',
        });
    }

    try {
        const order = await Order.findOne({
            _id: orderId,
            shopId: user.role.shopId,
        });

        if (!order) {
            return res.status(404).send({
                message: 'Order not found or does not belong to your shop',
            });
        }
        order.status = newStatus;
        await order.save();

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error occurred' });
    }
};

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

module.exports = { getAdminOrders, updateOrderStatus };
