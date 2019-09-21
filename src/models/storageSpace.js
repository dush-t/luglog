const mongoose = require('mongoose');

const storageSpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,   // Google Maps location URL
        required: false,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    avatar: {
        type: Buffer,
    },
    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area'
    },
    checkoutRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
    }],
    costPerHour: {
        type: Number,
        required: true,
        default: 100
    },
    open: {
        type: Boolean,
        required: true,
        default: true
    },
    rating: {
        type: Number,
        required: true,
        default: 3
    },
    type: {
        type: String
    }
})

storageSpaceSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'storageSpace'
})

storageSpaceSchema.methods.toJSON = function () {
    const storageSpaceObject = this.toObject();
    delete storageSpaceObject.checkoutRequests;
    return storageSpaceObject;
}

const StorageSpace = mongoose.model('StorageSpace', storageSpaceSchema);
module.exports = StorageSpace;