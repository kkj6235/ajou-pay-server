var mongoose = require('mongoose');
const Store = mongoose.model('Store');
const Menu = mongoose.model('Menu');
const Order = mongoose.model('Order');
const User = mongoose.model('User');

const postOrder = async (req, res) => {};

const getwaitingCountTicket = async (req, res) => {
    try {
        if (!req.session.user) {
            res.status(403).send({ message: '인증오류' });
        }
        // Retrieve the store ID from the request parameters
        const storeId = req.params.id;

        // Find the store by ID
        let store = await Store.findById(storeId);

        // Check if the store exists
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Increment the waitingOrderCount
        store.waitingOrderCount += 1;

        // Save the updated store
        await store.save();

        // Respond with the updated store information
        res.json(store);
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).send({ message: 'Server error occurred' });
    }
};

module.exports = { postOrder, getwaitingCountTicket };

module.exports = { postOrder, getwaitingCountTicket };
