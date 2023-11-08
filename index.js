var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
const express_session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const shop = require('./api/shop');
const user = require('./api/user');
const controller = require('./api/user/user.controller');

require('dotenv').config();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.use(
    express_session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
    }),
);
app.use('/shop', shop);
app.use('/user', user);

app.listen(3000, () => {
    console.log('Server Running');
});

module.exports = app;
