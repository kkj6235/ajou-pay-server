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
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const shopId = parseInt(req.params.shopId);

        if (isNaN(shopId)) {
            return res.status(400).json({ message: 'Invalid shop ID' });
        }

        const menuItems = await Menu.find({ shopId: shopId });
        const shopItem = await Store.findOne({ _id: shopId });

        return res.json({
            shop: shopItem,
            menus: menuItems,
        });
    } catch (error) {
        return res.status(500).send({ message: '서버 오류가 발생했습니다.' });
    }
};

module.exports = { getShop, getShopMenu };
