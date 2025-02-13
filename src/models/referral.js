const mongoose = require('mongoose');
const axios = require('axios');

const User = require('./user');
const Coupon = require('./coupon');
const Customer = require('./customer');
const ReferralPartner = require('./referralPartner');
const ReferralUse = require('./referralUse');

const { referralTypes } = require('../constants/referralTypes');
const { couponTypes } = require('../constants/couponTypes');
const { referralDiscountConstants } = require('../constants/couponConstants');
const { cashfreeModeTypes } = require('../constants/cashfreeModeTypes');

const { generateCouponCode, generateCashfreeTransferId } = require('../utils/randomString');
const { renewToken } = require('../utils/cashfree');
const { getValueOrFallback } = require('../utils/helpers');



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
    },
    couponTemplate: {
        value: {
            type: Number,
            default: 25
        },
        constraints: {
            type: String,
            default: '{}'
        },
        title: {
            type: String,
            default: '25% Off!'
        },
        description: {
            type: String,
            default: 'Get FLAT 25% off on this booking!'
        }
    }
})

referralSchema.index({ code: 1, user: 1 });



const handleRefPartnerReferral = async (referral, user, booking) => {
    if (referral.type !== referralTypes.REF_PARTNER_TO_CUSTOMER) {
        throw new Error(`Invalid referral type ${referral.type} for parent user type ${user.type}`);
    }
    const referralPartner = await ReferralPartner.findOne({ user: user._id });
    const cashfreeData = {
        ...referralPartner.cashfreeData,
        address1: referralPartner.address,
        amount: parseFloat(referralPartner.cashbackAmount) || parseFloat(process.env.REF_PARTNER_CASHBACK_AMOUNT),
        transferId: generateCashfreeTransferId(),
        transferMode: referralPartner.cashfreeData.transferMode || cashfreeModeTypes.PAYTM // for now.
    }
    renewToken() // renew cashfree token because their workflow is shit.
    const response = await axios.post(`${process.env.CASHFREE_BASE_URL}/payout/v1/requestTransfer`, cashfreeData, {
        headers: {
            Authorization: `Bearer ${process.env.CASHFREE_AUTH_TOKEN}`
        }
    })

    if (response.status === 200) {
        const referralUse = new ReferralUse({
            cashfreeTransferId: cashfreeData.transferId,
            amount: cashfreeData.amount,
            referral: referral._id,
            booking: booking._id,
            cashfreeTransferMode: cashfreeData.transferMode
        });
        await referralUse.save();
    }
    // pay the guy
}

const handleCustomerToCustomerReferral = async (referral, user, booking) => {
    if (referral.type !== referralTypes.CUSTOMER_TO_CUSTOMER) {
        throw new Error(`Invalid referral type ${referral.type} for parent user type ${user.type}`);
    }

    const customer = await Customer.findOne({ user: user._id })
    const coupon = referral.generateCoupon();
    customer.coupons = customer.coupons.concat(coupon._id);
    await customer.save();

    const referralUse = new ReferralUse({
        referral: referral._id,
        booking: booking._id,
        coupon: coupon._id
    });
    await referralUse.save();

}


const generateDiscountCoupon = async (referral) => {
    const coupon = new Coupon({
        type: couponTypes.REFERRAL_DICSOUNT,
        value: referral.couponTemplate.value,
        constraints: referral.couponTemplate.constraints,
        title: referral.couponTemplate.title,
        description: referral.couponTemplate.description,
        expiryTime: null,
        code: generateCouponCode(),
        relatedReferral: referral._id
    })
    await coupon.save();
    return coupon;
}


referralSchema.methods.handle = async function(booking=null) {
    // appropriately handle the referral
    const user = await User.findById(this.user);
    switch (this.type) {
        case referralTypes.REF_PARTNER_TO_CUSTOMER: handleRefPartnerReferral(this, user, booking); break;
        case referralTypes.CUSTOMER_TO_CUSTOMER: handleCustomerToCustomerReferral(this, user, booking); break;
        case referralTypes.REFERRAL_PARTNER_NON_PAYMENT: break;
    }
}


referralSchema.methods.generateCoupon = async function() {
    switch (this.type) {
        case referralTypes.CUSTOMER_TO_CUSTOMER: return (await generateDiscountCoupon(this));
        case referralTypes.REF_PARTNER_TO_CUSTOMER: return (await generateDiscountCoupon(this));
        case referralTypes.REFERRAL_PARTNER_NON_PAYMENT: return (await generateDiscountCoupon(this));
    }
}


const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;