var mongoose = require('mongoose');
const Store = mongoose.model('Store');
const Menu = mongoose.model('Menu');

const getShop = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const stores = await Store.find({});
        return res.json(stores);
    } catch (error) {
        return res.status(500).send({ message: '서버 오류가 발생했습니다.' });
    }
};

const getShopMenu = async (req, res) => {
    try {
        // Check if the user is authenticated
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Retrieve the shopId from the request parameters and convert it to an integer
        const shopId = parseInt(req.params.shopId);

        // Validate shopId (check if it's a valid number)
        if (isNaN(shopId)) {
            return res.status(400).json({ message: 'Invalid shop ID' });
        }

        // Find menu items that belong to the shop
        const menuItems = await Menu.find({ shopId: shopId });

        // FInd shop item about the information of the shop
        const shopItem = await Store.findOne({ _id: shopId });

        // Respond with the menu items
        return res.json({
            shop: shopItem,
            menus: menuItems
        });
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).send({ message: '서버 오류가 발생했습니다.' });
    }
};

module.exports = { getShop, getShopMenu };
