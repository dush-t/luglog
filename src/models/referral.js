const mongoose = require('mongoose');
const axios = require('axios');

const User = require('./user');
const Coupon = require('./coupon');
const Customer = require('./customer');
const ReferralPartner = require('./referralPartner');

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



const handleRefPartnerReferral = async (referral, user) => {
    console.log('refpartner function called')
    if (referral.type !== referralTypes.REF_PARTNER_TO_CUSTOMER) {
        throw new Error(`Invalid referral type ${referral.type} for parent user type ${user.type}`);
    }
    const referralPartner = await ReferralPartner.findOne({ user: user._id });
    const cashfreeData = {
        ...referralPartner.cashfreeData,
        name: user.name,
        email: user.email,
        phone: user.mobile_number.toString()
    }
    const response = await axios.post(`${CASHFREE_BASE_URL}/payout/v1/addBeneficiary`, cashfreeData, {
        headers: {
            Authorization: `Bearer ${process.env.CASHFREE_AUTH_TOKEN}`
        }
    })

    console.log('payout request response', response.data)

    if (response.status !== 200) {
        console.log(response.status, response.data)
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


const generateDiscountCoupon = async (referral) => {
    const coupon = new Coupon({
        type: couponTypes.REFERRAL_DICSOUNT,
        value: referralDiscountConstants.VALUE,
        constraints: referralDiscountConstants.CONSTRAINTS,
        title: referralDiscountConstants.TITLE,
        description: referralDiscountConstants.DESCRIPTION,
        expiryTime: null,
        code: generateCouponCode(),
        relatedReferral: referral._id
    })
    await coupon.save();
    return coupon;
}


referralSchema.methods.handle = async function() {
    // appropriately handle the referral
    const user = await User.findById(this.user);
    switch (this.type) {
        case referralTypes.REF_PARTNER_TO_CUSTOMER: handleRefPartnerReferral(this, user); break;
        case referralSchema.CUSTOMER_TO_CUSTOMER: handleCustomerToCustomerReferral(this, user); break;
    }
}


referralSchema.methods.generateCoupon = async function() {
    switch (this.type) {
        case referralTypes.CUSTOMER_TO_CUSTOMER: return (await generateDiscountCoupon(this));
        case referralTypes.REF_PARTNER_TO_CUSTOMER: return (await generateDiscountCoupon(this));
    }
}


const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;