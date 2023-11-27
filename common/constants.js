const DEV_CLIENT_URL = 'http://localhost:3000';
const PROD_CLIENT_URL = 'https://';
const CLIENT_URL = process.env.NODE_ENV === 'production' ? PROD_CLIENT_URL : DEV_CLIENT_URL;

const CLIENT_ROUTE = {
    SUCCESS: '/order/success',
    FAIL: '/order/fail',
    CANCEL: '/order/cancel'
}

module.exports = {
    CLIENT_URL,
    CLIENT_ROUTE
}
