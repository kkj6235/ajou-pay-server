var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var shop = require('./api/shop/index.js');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', shop);

app.listen(3000, () => {
    console.log('Server Running');
});

module.exports = app;
