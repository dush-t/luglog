const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    isLuggageStored: {
        type: Boolean,
        default: false
    },
    forgotPasswordOTP: {
        type: String
    },
    coupons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    }],
    couponsUsed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    }],
    govtIds: [{
        idType: {
            type: String,
            default: 'Aadhar'
        },
        idValue: {
            type: String
        }
    }]
})

customerSchema.index({ user: 1 });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;