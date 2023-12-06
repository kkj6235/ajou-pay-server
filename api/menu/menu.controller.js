var mongoose = require('mongoose');
const Menu = mongoose.model('Menu');

const getMenu = async (req, res) => {
    try {
        if (!req.session.user) {
            return res
                .status(401)
                .send({ message: 'Unauthorized: No session found' });
        }

        const menus = await Menu.find({});

        res.status(200).json(menus);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error occurred' });
    }
};

const getMenuById = async (req, res) => {
    try {
        if (!req.session.user) {
            return res
                .status(401)
                .send({ message: 'Unauthorized: No session found' });
        }

        const menuId = req.params.menuId;
        if (!mongoose.Types.ObjectId.isValid(menuId)) {
            return res.status(400).send({ message: 'Invalid Menu ID' });
        }

        const menu = await Menu.findById(menuId);

        if (!menu) {
            return res.status(404).send({ message: 'Menu not found' });
        }

        res.status(200).json(menu);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error occurred' });
    }
};

module.exports = { getMenu, getMenuById };
