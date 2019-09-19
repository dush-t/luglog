const mongoose = require('mongoose');
const StorageSpace = require('../models/storageSpace');

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
    // status: {                           // 0 --> Checked in
    //     type: Number,                   // 1 --> Checkout requested by user
    //     default: 0,                     // 2 --> Checkout approved by vendor
    //     required: true                  // 3 --> Checked out
    // },
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
    checkoutTime: {
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
    }
}, {
    timestamps: true,
})



bookingSchema.index({ storageSpace: 1 });



// bookingSchema.methods.calculatePrice = async function () {
//     let netStorageCost = 0
//     const now = (new Date()).getTime();
//     this.luggageItems.forEach((luggageItem) => {
//         const checkInTime = luggageItem.checkInTime.getTime();
//         const timeDelta = (now - checkInTime) / 1000;  // Getting time difference in seconds.
//         const totalStorageCost = (this.costPerHour / 3600) * timeDelta;
//         luggageItem.totalStorageCost = totalStorageCost;
//         await luggageItem.save()
//         netStorageCost = netStorageCost + totalStorageCost;
//     })
//     await this.save();
//     return netStorageCost;
// }



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



const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;


