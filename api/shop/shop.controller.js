var mongoose = require('mongoose');
const Store = mongoose.model('Store');

const getShop = async (req, res) => {
    try {
        const stores = await Store.find({});
        res.json(stores);
    } catch (error) {
        res.status(500).send({ message: '서버 오류가 발생했습니다.' });
    }
};

module.exports = { getShop };
