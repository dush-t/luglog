const mongoose = require('mongoose');

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
    luggageItems: [{
        itemId: {
            type: String,
            required: true
        },
        photo: {
            type: Buffer,
            required: false     // I like being explicit
        },
        checkInTime: {
            type: Date,
            default: Date.now,
            required: true
        },
        checkoutTime: {
            type: Date,
            required: false
        }
    }]
}, {
    timestamps: true,
})

bookingSchema.index({ storageSpace: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Club;