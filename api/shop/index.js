const express = require('express');
const router = express.Router();
const controller = require('./shop.controller');

router.get('/', controller.getShop);

module.exports = router;
