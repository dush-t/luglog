const express = require('express');
const Razorpay = require('razorpay');

const Booking = require('../models/booking');
const Transaction = require('../models/transaction');
const Customer = require('../models/customer');
const Coupon = require('../models/coupon');
const StorageSpace = require('../models/storageSpace');

const { sendBookingEmailToSpace, sendBookingEmailToUser } = require('../utils/email');
const { generateRazorpayRecieptId } = require('../utils/randomString');
const { alertMessage } = require('../utils/appMessage');
const { tellOurselvesWeFuckedUp } = require('../utils/slack');
const { updateHubspotDeal, createHubspotDeal, updateHubspotContact } = require('../utils/hubspot');

const auth = require('../middleware/auth');
const versionCheck = require('../middleware/versionCheck');

const { hubspotDealStages } = require('../constants/hubspotDealStages');



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


    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_ID,
        key_secret: process.env.RAZORPAY_SECRET
    })
    instance.orders.create(options, async function (err, order) {
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
    const transaction = await Transaction.findById(req.body.transaction_id).populate('user');
    const booking = await Booking.findOne({ transaction: transaction._id }).populate('storageSpace');
    const customer = await Customer.findOne({ user: req.user._id });

    // Only allow customer to pay for recently made bookings.
    if (!booking._id.equals(customer.latestBooking)) {
        // VERY SUSPICIOUS ACTIVITY
        tellOurselvesWeFuckedUp('latestBooking check failed', `The check failed for the user ${req.user.name} (${req.user.mobile_number}).`)
        return res.status(403).send(alertMessage('ERROR', 'Something wrong happened at our end. Please contact support immediately.'));
    }

    if (!transaction) {
        tellOurselvesWeFuckedUp('404 on Transaction', `Transaction was not found for ${req.user.name} (${req.user.mobile_number})'s booking. TxnId: ${req.body.transaction_id}`)
        return res.status(404).send(alertMessage('ERROR', 'A transaction could not be generated for your booking. Please contact support immediately.'));
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;


    if (transaction.hasValidSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
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

        //Send booking emails
        sendBookingEmailToSpace(booking.storageSpace.email, {storageSpace: booking.storageSpace, booking: booking, user: transaction.user});
        sendBookingEmailToUser(transaction.user.email, {storageSpace: booking.storageSpace, booking: booking, user: transaction.user});

        // Increase booking count
        const s = StorageSpace.findById(booking.storageSpace._id);
        s.numOfBookings = s.numOfBookings + 1;
        await s.save();

        // Move deal forward
        try {
            updateHubspotDeal(customer.currentHubspotDealId, hubspotDealStages.CLOSED_WON)
            const newDeal = await createHubspotDeal({
                associations: {
                    associatedVids: [req.user.hubspotVid]
                },
                properties: {
                    dealname: req.user.name,
                    dealstage: hubspotDealStages.RECURRING,
                    pipeline: 'default',
                    dealtype: 'cloakroombooking'
                }
            })
            customer.currentHubspotDealId = newDeal.dealId;
            customer.numSuccessfulBookings = customer.numSuccessfulBookings + 1;
            await customer.save()
    
            updateHubspotContact(req.user.hubspotVid, {
                properties: {
                    number_of_successful_bookings: customer.numSuccessfulBookings
                }
            })
        } catch (e) {
            console.log(e)
            tellOurselvesWeFuckedUp(`New deal creation after successful booking failed for ${req.user.name} - ${req.user._id}`)
        }

    }

    return res.status(200).send(transaction);
})

module.exports = router;