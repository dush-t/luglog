const express = require('express');
const Razorpay = require('razorpay');

const Booking = require('../models/booking');
const Transaction = require('../models/transaction');
const Customer = require('../models/Customer');
const Coupon = require('../models/Coupon');

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
        amount: Math.round(booking.netStorageCost * 100),
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


router.post('/api/confirmAppPayment', versionCheck, auth, async (req, res) => {
    const transaction = await Transaction.findById(req.body.transaction_id).populate('user');
    const booking = await Booking.findOne({ transaction: transaction._id }).populate('storageSpace');
    const customer = await Customer.findOne({ user: user._id });

    // Only allow customer to pay for recently made bookings.
    if (!booking._id.equals(customer.lastBooking)) {
        // VERY SUSPICIOUS ACTIVITY
        return res.status(403).send();
    }

    if (!transaction) {
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
            const coupon = await Coupon.findById(booking.couponUsed).populate('relatedReferral');
            if (coupon.relatedReferral) {
                const referral = coupon.relatedReferral;
                await referral.handle(booking);
            }
        }

        // Send booking emails
        sendBookingEmailToSpace(booking.storageSpace.email, {storageSpace: booking.storageSpace, booking: booking, user: transaction.user});
        sendBookingEmailToUser(transaction.user.email, {storageSpace: booking.storageSpace, booking: booking, user: transaction.user});

    }

    return res.status(200).send(transaction);
})


// Paytm will send info to this endpoint on transaction completion
router.post('/api/confirmPayment/:transaction_id', async (req, res) => {
    
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    console.log(req.body)
    console.log(razorpay_payment_id, razorpay_payment_id, razorpay_signature)
    
    const transaction = await Transaction.findOne({ razorpayOrderId: req.body.razorpay_order_id}).populate({
        path: 'user',
        model: 'User'
    }).populate({
        path: 'booking',
        model: 'Booking',
        populate: {
            path: 'storageSpace',
            model: 'StorageSpace'
        }
    });
    
    if (Transaction.hasValidSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
        transaction.status = 'COMPLETE';
        await transaction.save();
        console.log(transaction.booking[0]);

        // const userBody = `Booking confirmed! Your booking for cloakroom facility at ${transaction.booking[0].storageSpace.name} has been confirmed.`
        // sendSMS(transaction.user.mobile_number, userBody)
        const booking  = transaction.booking[0]


        const vendorBody = `
New Booking received, GoLuggageFree!

Booking ID: ${booking.bookingId}
Govt. ID Proof: ${booking.userGovtId}
Name: ${transaction.user.name}

Number of bags: ${transaction.numberOfBags}
Check-in time: ${transaction.checkInTime}
Check-out time: ${transaction.checkOutTime}

Total booking amount: ${booking.netStorageCost}
(Paid online)
`

        sendSMS(transaction.booking[0].storageSpace.number, vendorBody)

        res.render('paymentSuccessful', {title: 'SUCCESS'});
        
        // email not so important, so will send it after the payment is complete.
        sendBookingEmailToSpace(transaction.booking[0].storageSpace.email, {storageSpace: booking.storageSpace, booking: booking, user: transaction.user});
        sendBookingEmailToUser(transaction.user.email, {storageSpace: booking.storageSpace, booking: booking, user: transaction.user});

        throw new Error(`Booking recieved! ${transaction.user.name}, ${transaction.user.mobile_number}, ${booking.storageSpace.name}, ${booking._id.toString()}`);

    } else {
        // return res.status(400).send();
        res.render('paymentSuccessful', {title: 'FAILURE'});
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