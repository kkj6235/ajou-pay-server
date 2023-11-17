var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
const express_session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

try {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
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

require('./db/models/User');

const shop = require('./api/shop');
const user = require('./api/user');

app.use('/shop', shop);
app.use('/user', user);

app.listen(3000, () => {
    console.log('Server Running');
});

module.exports = app;
