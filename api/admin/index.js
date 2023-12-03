const express = require('express');
const router = express.Router();
const controller = require('./admin.controller');

router.get('/order', controller.getAdminOrders);

module.exports = router;
