var mongoose = require('mongoose');
const axios = require('axios');
const Store = mongoose.model('Store');
const Menu = mongoose.model('Menu');
const Order = mongoose.model('Order');
const User = mongoose.model('User');
const Payment = mongoose.model('Payment');

const calculateItemPrice = async (item) => {
    const menu = await Menu.findById(item.menuId);
    return menu.price * item.quantity;
};

const postOrder = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(403).send({ message: '인증오류' });
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
            approval_url: 'http://localhost:3000/success',
            fail_url: 'http://localhost:3000/fail',
            cancel_url: 'http://localhost:3000/cancel',
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
            waitingCount: store.waitingOrderCount,
        });

        await payment.save();

        const responseData = { ...kakaoResponse.data };
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
            res.status(403).send({ message: '인증오류' });
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

module.exports = { postOrder, getwaitingCountTicket };
