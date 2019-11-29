const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const customerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        autopopulate: true
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
    }],
    latestBooking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }
})

customerSchema.index({ user: 1 });
customerSchema.plugin(autopopulate);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;