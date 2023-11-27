const express = require('express');
const router = express.Router();
const controller = require('./order.controller');

router.post('/', controller.postOrder);
router.post('/approve', controller.postVerifyOrder);
router.get('/:id', controller.getwaitingCountTicket);

module.exports = router;
