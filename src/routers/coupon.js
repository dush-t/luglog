const express = require('express');

const auth = require('../middleware/auth');
const adminAccess = require('../middleware/adminAccess');
const versionCheck = require('../middleware/versionCheck');

const Customer = require('../models/customer');
const Coupon = require('../models/coupon');
const StorageSpace = require('../models/storageSpace');

const { couponContextTypes } = require('../constants/couponContextTypes');


const router = new express.Router();


// SEND LIST OF COUPONS THAT ARE APPLICABLE FOR GIVEN BOOKING
router.post('/api/getApplicableCoupons', versionCheck, auth, async (req, res) => {
    console.log(req.body);
    const user = req.user;
    let customer = await Customer.findOne({ user: user._id}).populate('coupons').populate('bookings');
    customer.user = user
    // console.log('customer found', customer)
    let booking = req.body.booking;
    const storageSpace = await StorageSpace.findById(booking.storageSpace);
    booking.storageSpace = storageSpace

    const context = {
        type: couponContextTypes.CUSTOMER_CLOAKROOM_BOOKING,
        booking,
        customer
    }

    // console.log(context);
    let coupons = await Coupon.find({ isGlobal: true, visibleGlobal: true })
    coupons = coupons.concat(customer.coupons);

    let usableCoupons = [];
    let unusableCoupons = []
    coupons.forEach((coupon) => {
        const couponObj = coupon.toObject();
        delete couponObj.constraints;
        if (coupon.expired()) {
            return;     // No point sending coupons that can NEVER Be used.
            // await coupon.delete()?
        }
        if (coupon.checkApplicability(context).passed) {
            usableCoupons.push(couponObj)
        } else {
            unusableCoupons.push(couponObj)
        }
    });
    

    res.status(200).send({usableCoupons, unusableCoupons});
})


// SEND LIST OF UN-EXPIRED, UNUSED COUPONS OWNED BY USER
router.get('/api/getOwnedCoupons', auth, async (req, res) => {
    console.log('function called')
    const user = req.user;
    const customer = await Customer.findOne({ user: user._id }).populate('coupons');
    console.log('customer found', customer)
    let coupons = customer.coupons.filter((coupon) => {
        console.log(coupon.expired(), coupon);
        return (!coupon.expired() && !coupon.used)
    })
    
    const globalVisibleCoupons = await Coupon.find({ isGlobal: true, visibleGlobal: true })
    coupons = coupons.concat(globalVisibleCoupons);

    return res.status(200).send(coupons);
})


router.post('/api/addCouponToUser', auth, adminAccess, async (req, res) => {
    console.log('function called');
    const customer = await Customer.findById(req.body.customerId);
    console.log('customer found', customer)

    const coupon = await Coupon.findById(req.body.couponId);
    console.log('coupon found', coupon)
    
    customer.coupons = customer.coupons.concat(coupon._id);
    await customer.save();
    console.log('customer saved');
    return res.send(coupon);
})

module.exports = router;