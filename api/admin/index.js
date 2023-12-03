const express = require('express');
const router = express.Router();
const controller = require('./admin.controller');

router.get('/order', controller.getAdminOrders);
router.put('/order', controller.updateOrderStatus);

module.exports = router;
