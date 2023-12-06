var mongoose = require('mongoose');
const Menu = mongoose.model('Menu');

const getMenuById = async (req, res) => {
    try {
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

module.exports = { getMenuById };
