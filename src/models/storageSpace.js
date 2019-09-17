const mongoose = require('mongoose');

const storageSpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    coordinates: {
        cX: {
            type: Number,
        },
        cY: {
            type: Number
        }
    },
    avatar: {
        type: Buffer,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    checkoutRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
    }]
})

storageSpaceSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'storageSpace'
})

const StorageSpace = mongoose.model('StorageSpace', storageSpaceSchema);
module.exports = StorageSpace;