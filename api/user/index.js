const express = require('express');
const router = express.Router();
const controller = require('./user.controller');

router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);
router.put('/:userId', controller.updateUser);
router.get('/logout', controller.getLogout);
module.exports = router;
