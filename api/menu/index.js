const express = require('express');
const router = express.Router();
const controller = require('./menu.controller');

router.get('/', controller.getMenu);
router.get('/:menuId', controller.getMenuById);

module.exports = router;
