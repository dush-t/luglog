const mongoose = require('mongoose');

const StorageSpace = require('./storageSpace');
const Referral = require('./referral');

const { couponTypes } = require('../constants/couponTypes');
const { userGovtIdTypes } = require('../constants/userGovtIdTypes');

const bookingSchema = new mongoose.Schema({
    storageSpace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StorageSpace',
        required: true
    },
    consumer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    costPerHour: {
        type: Number,
        required: true
    },
    numberOfBags: {
        type: Number,
        required: true,
        default: 1
    },
    luggageItems: [{
        photo: {
            type: Buffer,
            required: false     // I like being explicit
        },
        totalStorageCost: {     // Will be useful when the vendor app is made in the future, so not removing this.
            type: Number,
            required: false,
        }
    }],
    checkInTime: {
        type: Date,
        default: Date.now,
        // required: true
    },
    checkOutTime: {
        type: Date,
        required: false
    },
    netStorageCost: {
        type: Number,
        required: true,
        default: 0
    },
    schemaVersion: {            // Will help a lot later when I drastically change database structure and schema methods.
        type: Number,
        required: true,
        default: 1
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    bookingId: {
        type: String,
        required: true,
        default: 'TLOTHW'
    },
    userGovtId: {
        type: String,
        required: true,
        default: userGovtIdTypes.AADHAR
    },
    userGovtIdType: {
        type: String,
        required: true,
        default: ''
    },
    bookingPersonName: {
        type: String,
        required: true
    },
    numberOfDays: {
        type: Number,
        required: true,
        default: 1
    },
    couponUsed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
        default: null
    }
}, {
    timestamps: true,
})



bookingSchema.index({ storageSpace: 1 });



bookingSchema.methods.setPrice = async function () {
    const timeDelta = (this.checkoutTime.getTime() - this.checkInTime.getTime()) / 1000;      // getTime() returns time in milliseconds
    const totalStorageCost = (this.costPerHour / 3600) * timeDelta;

    this.luggageItems.forEach((luggageItem) => {
        luggageItem.totalStorageCost = totalStorageCost;
    })
    this.netStorageCost = this.luggageItems.length * this.costPerHour;
    await this.save();
}


bookingSchema.methods.requestCheckout = async function () {
    if (this.status > 0) {
        throw new Error('Checkout has already been requested.')
    }
    const targetStorageSpace = StorageSpace.findById(this.storageSpace);
    targetStorageSpace.checkoutRequests.push(this._id);
    this.status = 1;
    // Three database writes here - non atomic. Improve this later.
    await targetStorageSpace.save();
    this.calculatePrice();
    await this.save();
    return this;
}



bookingSchema.methods.approveCheckout = async function () {
    if (this.status !== 1) {
        throw new Error('Checkout approval is not possible at this stage of the booking');
    }
    const targetStorageSpace = StorageSpace.findById(this.storageSpace);
    const checkoutRequests = targetStorageSpace.checkoutRequests.filter((checkoutRequest) => !checkoutRequest.equals(this._id))
    targetStorageSpace.checkoutRequests = checkoutRequests;
    this.status = 2;
    await targetStorageSpace.save();
    await this.save();
    return this;
}


bookingSchema.methods.applyCoupon = async function (coupon, context) {
    if (coupon.type === couponTypes.DISCOUNT) {
        this.netStorageCost = this.netStorageCost * (1 - coupon.value/100);
        this.couponUsed = coupon._id;
        if (coupon.numberOfUsesBy(context.customer) === (coupon.numUsesAllowed - 1)) {
            coupon.used = true
            await coupon.save()
        }
    }

    // Not handling the referral here because I want the booking to be saved before giving
    // out any coupons.
}



const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;


