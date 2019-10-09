const express = require('express');
const Booking = require('../models/booking');
const Transaction = require('../models/transaction');
const checksum = require('../utils/checksum');
const axios = require('axios');
const Razorpay = require('razorpay');
const path = require('path');
const hbs = require('hbs')


const auth = require('../middleware/auth');

const { generateRazorpayRecieptId } = require('../utils/randomString');


const router = new express.Router()

router.post('/api/payFor/:booking_id', auth, async (req, res) => {
    const booking = await Booking.findById(req.params.booking_id);

    const receiptId = generateRazorpayRecieptId(req.user.mobile_number);

    // Creating razorpay order
    const options = {
        amount: Math.round(booking.netStorageCost * 100),
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
            amount: Math.round(booking.netStorageCost),
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
            prefillContact: req.user.mobile_number,
            callback_url: `https://luglog.herokuapp.com/api/confirmPayment/${transaction._id}`
        }

        res.status(201).send(data);
    });
});


// Paytm will send info to this endpoint on transaction completion
router.post('/api/confirmPayment/:transaction_id', async (req, res) => {
    
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    console.log(req.body)
    console.log(razorpay_payment_id, razorpay_payment_id, razorpay_signature)
    
    const transaction = await Transaction.findOne({ razorpayOrderId: req.body.razorpay_order_id});
    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_ID,
        key_secret: process.env.RAZORPAY_SECRET
    })
    
    if (transaction.hasValidSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
        transaction.status = 'COMPLETE';
        await transaction.save();
        console.log(transaction);
        return res.status(200).send(transaction);
    } else {
        return res.status(400).send();
    }
})

router.get('/initiatePayment/:transaction_id', async (req, res) => {
    const transaction = await Transaction.findById(req.params.transaction_id).populate({
        'path': 'user',
        'models': 'User'
    })
    res.render('payView', {
        'key_id': process.env.RAZORPAY_ID,
        'order_id': transaction.razorpayOrderId,
        'user_name': transaction.user.name,
        'user_number': transaction.user.mobile_number,
        'user_email': transaction.user.email
    });
})

module.exports = router;