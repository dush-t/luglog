const express = require('express');

const User = require('../models/user');
const Customer = require('../models/customer');
const Referral = require('../models/referral');

const {sendWelcomeEmail} = require('../utils/email');
const {generateUUID, generateRandomInt} = require('../utils/randomString');
const { sendNewUserNotification } = require('../utils/slack');

const { userTypes } = require('../constants/userTypes');


const router = new express.Router();


router.post('/customer', async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile_number: req.body.mobile_number,
            password: req.body.password,
            uniqueId: generateUUID(req.body.mobile_number)
        });

        await user.save();

        if (req.body.userType === userTypes.CUSTOMER) {
            const customer = new Customer({
                user: user._id,
                bookings: [],
                coupons: [],
                couponsUsed: []
            })
            
            if (req.body.referralCode) {
                const referral = await Referral.findOne({ code: req.body.referralCode })
                const coupon = await referral.generateCoupon();
                customer.coupons = customer.coupons.concat(coupon._id);
            }
            await customer.save();
        }

        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user: user, token: token });
        sendNewUserNotification(user);
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
});


module.exports = router;