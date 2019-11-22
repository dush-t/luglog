const mongoose = require('mongoose');

const User = require('./user');
const Coupon = require('./coupon');
const Customer = require('./customer');

const { referralTypes } = require('../constants/referralTypes');
const { couponTypes } = require('../constants/couponTypes');
const { referralDiscountConstants } = require('../constants/couponConstants');

const { generateCouponCode } = require('../utils/randomString');



const referralSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        default: referralTypes.CUSTOMER_TO_CUSTOMER
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    code: {
        type: String,
        required: true,
        unique: true
    }
})

referralSchema.index({ code: 1 });



const handleRefPartnerReferral = (referral, user) => {
    if (referral.type !== referralTypes.REF_PARTNER_TO_USER) {
        throw new Error(`Invalid referral type ${referral.type} for parent user type ${user.type}`);
    }
    // pay the guy
}

const handleCustomerToCustomerReferral = async (referral, user) => {
    if (referral.type !== referralTypes.CUSTOMER_TO_CUSTOMER) {
        throw new Error(`Invalid referral type ${referral.type} for parent user type ${user.type}`);
    }

    const customer = await Customer.findOne({ user: user._id })
    const coupon = new Coupon({
        type: couponTypes.REFERRAL_DICSOUNT,
        value: referralDiscountConstants.VALUE,
        constraints: referralDiscountConstants.CONSTRAINTS,
        title: referralDiscountConstants.TITLE,
        description: referralDiscountConstants.DESCRIPTION,
        code: generateCouponCode(),
        relatedReferral: referral._id
    })

    await coupon.save();
    customer.coupons = customer.coupons.concat(coupon._id);
    await customer.save();
}


referralSchema.methods.handle = async function() {
    // appropriately handle the referral
    const user = await User.findById(this.user);
    switch (this.type) {
        case referralTypes.REF_PARTNER_TO_USER: handleRefPartnerReferral(this, user); break;
        case referralSchema.CUSTOMER_TO_CUSTOMER: handleCustomerToCustomerReferral(this, user); break;
    }
}


referralSchema.methods.generateCoupon = async function() {
    if (this.type === referralTypes.CUSTOMER_TO_CUSTOMER) {
        const coupon = new Coupon({
            type: couponTypes.REFERRAL_DICSOUNT,
            value: referralDiscountConstants.VALUE,
            constraints: referralDiscountConstants.CONSTRAINTS,
            title: referralDiscountConstants.TITLE,
            description: referralDiscountConstants.DESCRIPTION,
            expiryTime: null,
            code: generateCouponCode(),
            relatedReferral: this._id
        })
        await coupon.save();
        return coupon;
    }
}


const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;