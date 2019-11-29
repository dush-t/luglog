const mongoose = require('mongoose');
const { cashfreeModeTypes } = require('../constants/cashfreeModeTypes');

const referralPartnerSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cashbackAmount: {
        type: Number,
        default: 10
    },
    cashfreeData: {
        beneId: {
            type: String,
            required: true
        },
        group: [{
            type: String
        }],
        bankAccount: {
            type: String
        },
        ifsc: {
            type: String
        },
        vpa: {
            type: String
        },
        cardNo: {
            type: String
        },
        city: {
            type: String,
            default: 'Delhi'
        },
        state: {
            type: String,
            default: 'Delhi'
        },
        pincode: {
            type: String
        },
        transferMode: {
            type: String,
            default: cashfreeModeTypes.PAYTM
        }
    }
})

referralPartnerSchema.index({ user: 1 });

const ReferralPartner = mongoose.model('ReferralPartner', referralPartnerSchema);

module.exports = ReferralPartner;