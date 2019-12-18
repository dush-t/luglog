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
    const user = req.user;
    let customer = await Customer.findOne({ user: user._id}).populate('coupons').populate({
        path: 'bookings',
        model: 'Booking',
        populate: {
            path: 'transactions',
            model: 'Transaction'
        }
    });
    customer.user = user
    let booking = req.body.booking;
    const storageSpace = await StorageSpace.findById(booking.storageSpace);
    booking.storageSpace = storageSpace

    const context = {
        type: couponContextTypes.CUSTOMER_CLOAKROOM_BOOKING,
        booking,
        customer
    }

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
        if ((coupon.checkApplicability(context)).passed) {
            usableCoupons.push(couponObj)
        } else {
            unusableCoupons.push(couponObj)
        }
    });
    

    res.status(200).send({usableCoupons, unusableCoupons});
})


// SEND LIST OF UN-EXPIRED, UNUSED COUPONS OWNED BY USER
router.get('/api/getOwnedCoupons', auth, async (req, res) => {
    const user = req.user;
    const customer = await Customer.findOne({ user: user._id }).populate('coupons');
    let coupons = customer.coupons.filter((coupon) => {
        return (!coupon.expired() && !coupon.used)
    })
    
    const globalVisibleCoupons = await Coupon.find({ isGlobal: true, visibleGlobal: true })
    coupons = coupons.concat(globalVisibleCoupons);

    return res.status(200).send(coupons);
})


router.post('/api/addCouponToUser', auth, adminAccess, async (req, res) => {
    const customer = await Customer.findById(req.body.customerId);

    const coupon = await Coupon.findById(req.body.couponId);
    
    customer.coupons = customer.coupons.concat(coupon._id);
    await customer.save();
    return res.send(coupon);
})

module.exports = router;