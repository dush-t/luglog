const express = require('express');
const Razorpay = require('razorpay');

const Booking = require('../models/booking');
const Transaction = require('../models/transaction');
const Customer = require('../models/customer');
const Coupon = require('../models/coupon');

const { sendSMS } = require('../utils/sms');
const { sendBookingEmailToSpace, sendBookingEmailToUser } = require('../utils/email');
const { generateRazorpayRecieptId } = require('../utils/randomString');

const auth = require('../middleware/auth');
const versionCheck = require('../middleware/versionCheck');



const router = new express.Router()

router.post('/api/payFor/:booking_id', versionCheck, auth, async (req, res) => {
    const booking = await Booking.findById(req.params.booking_id);

    const receiptId = generateRazorpayRecieptId(req.user.mobile_number);

    // Creating razorpay order
    const options = {
        amount: Math.round(booking.netStorageCost) * 100,
        currency: "INR",
        receipt: receiptId,
        payment_capture: 0
    }

    console.log(booking);
    console.log(options)

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
            transaction_id: transaction._id,
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


router.post('/api/confirmAppPayment', auth, async (req, res) => {
    console.log('Inside transaction confirmation function');
    const transaction = await Transaction.findById(req.body.transaction_id).populate('user');
    console.log(transaction)
    const booking = await Booking.findOne({ transaction: transaction._id }).populate('storageSpace');
    console.log(booking)
    const customer = await Customer.findOne({ user: req.user._id });
    console.log('customer:', customer._id);

    console.log('request body:', req.body)

    // Only allow customer to pay for recently made bookings.
    if (!booking._id.equals(customer.latestBooking)) {
        // VERY SUSPICIOUS ACTIVITY
        console.log('latestBooking check failed')
        return res.status(403).send({
            message: {
                status: 'ERROR',
                level: 'CRITICAL',
                displayType: 'ALERT',
                title: 'Error',
                description: 'Something wrong happened at our end. Please contact support'
            }
        });
    }

    if (!transaction) {
        console.log('transaction not found')
        return res.status(404).send();
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    console.log(razorpay_payment_id, razorpay_order_id, razorpay_signature);


    if (transaction.hasValidSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
        console.log('Inside transaction-update block');
        transaction.razorpayOrderId = razorpay_order_id;
        transaction.razorpayPaymentId = razorpay_payment_id;
        transaction.status = 'COMPLETE';
        await transaction.save();
        
        // Handle the referral through which booking was made
        if (booking.couponUsed) {
            console.log('inside couponUsedBlock')
            const coupon = await Coupon.findById(booking.couponUsed).populate('relatedReferral');
            if (coupon.relatedReferral) {
                const referral = coupon.relatedReferral;
                await referral.handle(booking);
            }
        }

        //Send booking emails
        sendBookingEmailToSpace(booking.storageSpace.email, {storageSpace: booking.storageSpace, booking: booking, user: transaction.user});
        sendBookingEmailToUser(transaction.user.email, {storageSpace: booking.storageSpace, booking: booking, user: transaction.user});

    }

    return res.status(200).send(transaction);
})

module.exports = router;