const express = require('express');
const Booking = require('../models/booking');
const Transaction = require('../models/transaction');
const checksum = require('../utils/checksum');
const axios = require('axios');
const Razorpay = require('razorpay');

const auth = require('../middleware/auth');

const { generateRazorpayRecieptId } = require('../utils/randomString');


const router = new express.Router()

router.post('/api/payFor/:booking_id', auth, async (req, res) => {
    const booking = await Booking.findById(req.params.booking_id);

    const receiptId = generateRazorpayRecieptId(req.user.mobile_number);

    // Creating razorpay order
    const options = {
        amount: booking.netStorageCost * 100,
        currency: "INR",
        receipt: receiptId,
        payment_capture: 0
    }
    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_ID,
        key_secret: process.env.RAZORPAY_SECRET
    })
    instance.orders.create(options, async function (err, order) {
        console.log(order);
        console.log(err);        
        const transaction = new Transaction({
            amount: booking.netStorageCost,
            user: req.user._id,
            razorpayOrderId: order.id,
            razorpayReceiptId: order.receipt,
            razorpayOrderJSON: JSON.stringify(order)
        });
        await transaction.save();
        booking.transaction = transaction._id;
        await booking.save();

        const data = {
            key_id: process.env.RAZORPAY_ID,
            name: 'GoLuggageFree',
            description: 'Cloakrooms near you',
            image: '',
            order_id: order.id,
            prefillName: req.user.name,
            prefillEmail: req.user.email,
            prefillContact: req.user.contact,
            callback_url: `https://luglog.herokuapp.com/api/confirmPayment/${transaction._id}`
        }

        res.status(201).send(data);
    });
});


// Paytm will send info to this endpoint on transaction completion
router.post('/api/confirmPayment', async (req, res) => {
    const transaction = await Transaction.findOne({ paytmOrderId: req.body.ORDERID });

    checksumHash = req.body.CHECKSUMHASH;
    if (transaction.verifyChecksum()) {
        transaction.status = req.body.STATUS;
        transaction.paytmTransactionId = req.body.TXNID;
        transaction.paytmBankTransactionId = req.body.BANKTXNID;
        transaction.paymentGateway = req.body.GATEWAYNAME;
        transaction.bankName = req.body.BANKNAME || 'UPI-payment';
        transaction.paytmResponseCode = req.body.RESPCODE;
        transaction.paytmResponseMessage = req.body.RESPMSG;
        await transaction.save();

        // Do socket related shit here.
        return res.status(200).send();
    } else {
        console.log(req.body);
        return res.status(500).send();
    }
})


module.exports = router;