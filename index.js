var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
const express_session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(cors());

try {
    mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
} catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
}

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

require('./db/models/Store');
require('./db/models/Menu');
require('./db/models/Order');
require('./db/models/User');

const shop = require('./api/shop');
const user = require('./api/user');
const order = require('./api/order');

app.use('/shop', shop);
app.use('/user', user);
app.use('/order', order);

const port = 8080;
app.listen(port, () => {
    console.log(`Server Running on port ${port}`);
});

module.exports = app;
