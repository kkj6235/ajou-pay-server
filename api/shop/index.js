const express = require('express');
const router = express.Router();
const controller = require('./shop.controller');

router.get('/', controller.test);

module.exports = router;