const mongoose = require('mongoose')

const referralUseSchema = new mongoose.Schema({
    cashfreeTransferId: {
        type: String,
    },
    amount: {
        type: Number
    },
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Referral'
    },
    referral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Referral'
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    cashfreeTransferMode: {
        type: String
    }
})

const ReferralUse = mongoose.model('ReferralUse', referralUseSchema);

module.exports = ReferralUse;