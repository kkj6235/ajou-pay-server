var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
const express_session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { CLIENT_URL } = require('./common/constants');
const server = require('http').Server(app);
const { Server } = require('socket.io');

const ALLOWED_ORIGIN = [
    'http://localhost:3000',
    'https://ajou-order.netlify.app',
    'https://ajou-order.vercel.app',
];

const io = new Server(server, {
    cors: {
        origin: ALLOWED_ORIGIN,
        methods: '*',
        credentials: true,
    },
});

require('dotenv').config();

app.use(
    cors({
        origin: ALLOWED_ORIGIN,
        methods: '*',
        credentials: true,
    }),
);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

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

//FOR SOCKET
const sessionMiddleware = express_session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    }),
});
// DEFAULT SOCKET
app.use(sessionMiddleware);
const defaultNamespace = io.of('/ws');
defaultNamespace.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});
const clientSocketHandler = require('./socket/client.handler');
clientSocketHandler.init(io);
//

require('./db/models/Store');
require('./db/models/Menu');
require('./db/models/Order');
require('./db/models/User');
require('./db/models/Payment');

const indexx = require('./api');
const shop = require('./api/shop');
const user = require('./api/user');
const order = require('./api/order');
const admin = require('./api/admin');
const menu = require('./api/menu');

app.use('/api', indexx);
app.use('/api/shop', shop);
app.use('/api/user', user);
app.use('/api/order', order);
app.use('/api/admin', admin);
app.use('/api/menu', menu);

const port = 8080;
server.listen(port, () => {
    console.log(`Server Running on port ${port}`);
});

module.exports = app;
