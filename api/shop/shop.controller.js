var mongoose = require('mongoose');
const Store = mongoose.model('Store');
const Menu = mongoose.model('Menu');

const getShop = async (req, res) => {
    try {
        if (!req.session.user) {
            res.status(403).send({ message: '인증오류' });
        }
        const stores = await Store.find({});
        res.json(stores);
    } catch (error) {
        res.status(500).send({ message: '서버 오류가 발생했습니다.' });
    }
};

const getShopMenu = async (req, res) => {
    try {
        // Check if the user is authenticated
        if (!req.session.user) {
            return res.status(403).json({ message: '인증오류' });
        }

        // Retrieve the shopId from the request parameters and convert it to an integer
        const shopId = parseInt(req.params.shopId);

        // Validate shopId (check if it's a valid number)
        if (isNaN(shopId)) {
            return res.status(400).json({ message: 'Invalid shop ID' });
        }

        // Find menu items that belong to the shop
        const menuItems = await Menu.find({ shopId: shopId });

        // Respond with the menu items
        res.json(menuItems);
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).send({ message: '서버 오류가 발생했습니다.' });
    }
};

module.exports = { getShop, getShopMenu };
