var mongoose = require('mongoose');
const axios = require('axios');
const { CLIENT_URL, CLIENT_ROUTE } = require('../../common/constants');
const Store = mongoose.model('Store');
const Menu = mongoose.model('Menu');
const Order = mongoose.model('Order');
const User = mongoose.model('User');
const Payment = mongoose.model('Payment');

const postVerifyOrder = async (req, res) => {
    try {
        const { payment_id, pg_token } = req.body;
        const payment = await Payment.findById(payment_id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        const kakaoApproveData = {
            cid: 'TC0ONETIME',
            tid: payment.tid,
            partner_order_id: payment.waitingCount.toString(),
            partner_user_id: payment.userId.toString(),
            pg_token: pg_token,
        };

        const kakaoResponse = await axios.post(
            'https://kapi.kakao.com/v1/payment/approve',
            kakaoApproveData,
            {
                headers: {
                    Authorization: process.env.KAKAO_ADMIN,
                    'Content-type':
                        'application/x-www-form-urlencoded;charset=utf-8',
                },
            },
        );

        if (kakaoResponse.data.amount.total !== payment.totalPrice) {
            return res.status(400).json({ message: 'Invalid total amount' });
        }

        const order = new Order({
            userId: payment.userId,
            shopId: payment.shopId,
            items: payment.items,
            paymentMethod: kakaoResponse.data.payment_method_type,
            waitingCount: payment.waitingCount,
            takeout: payment.takeout,
            totalPrice: kakaoResponse.data.amount.total,
            createdTime: new Date(kakaoResponse.data.approved_at),
        });

        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error occurred' });
    }
};

const calculateItemPrice = async (item) => {
    const menu = await Menu.findById(item.menuId);
    return menu.price * item.quantity;
};

const postOrder = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        const { shopId, items, takeout } = req.body;

        const store = await Store.findById(shopId);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        store.waitingOrderCount += 1;
        await store.save();

        // Prepare data for Kakao Payment API
        const firstItem = await Menu.findById(items[0].menuId);
        const itemName = `${firstItem.name} 등 ${items.length}개`;
        const itemPrices = await Promise.all(
            items.map((item) => calculateItemPrice(item)),
        );
        const totalAmount = itemPrices.reduce((sum, price) => sum + price, 0);

        const kakaoPaymentData = {
            cid: 'TC0ONETIME',
            partner_order_id: store.waitingOrderCount.toString(),
            partner_user_id: req.session.user._id.toString(),
            item_name: itemName,
            quantity: 1,
            total_amount: totalAmount,
            vat_amount: 0,
            tax_free_amount: 0,
            approval_url: `${CLIENT_URL}${CLIENT_ROUTE.SUCCESS}`,
            fail_url: `${CLIENT_URL}${CLIENT_ROUTE.FAIL}`,
            cancel_url: `${CLIENT_URL}${CLIENT_ROUTE.CANCEL}`,
        };

        console.log(kakaoPaymentData);

        const kakaoResponse = await axios.post(
            'https://kapi.kakao.com/v1/payment/ready',
            kakaoPaymentData,
            {
                headers: {
                    Authorization: process.env.KAKAO_ADMIN,
                    'Content-type':
                        'application/x-www-form-urlencoded;charset=utf-8',
                },
            },
        );

        const payment = new Payment({
            tid: kakaoResponse.data.tid,
            userId: req.session.user._id,
            shopId: shopId,
            items: items,
            takeout: takeout,
            totalPrice: totalAmount,
            waitingCount: store.waitingOrderCount,
            approved: false,
        });

        const savedPayment = await payment.save();

        const responseData = {
            ...kakaoResponse.data,
            payment_id: savedPayment._id,
        };
        delete responseData.tid;

        res.json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error occurred' });
    }
};

const getwaitingCountTicket = async (req, res) => {
    try {
        if (!req.session.user) {
            res.status(401).send({ message: 'Unauthorized' });
        }
        // Retrieve the store ID from the request parameters
        const storeId = req.params.id;

        // Find the store by ID
        let store = await Store.findById(storeId);

        // Check if the store exists
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Increment the waitingOrderCount
        store.waitingOrderCount += 1;

        // Save the updated store
        await store.save();

        // Respond with the updated store information
        res.json(store);
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).send({ message: 'Server error occurred' });
    }
};

module.exports = { postOrder, getwaitingCountTicket, postVerifyOrder };
