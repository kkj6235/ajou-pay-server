const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const express_session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

router.get('/login', controller.getLogin);
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);
router.put('/:userId', controller.updateUser);
router.get('/logout', controller.getLogout);
module.exports = router;
