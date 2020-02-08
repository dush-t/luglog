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
    number: {
        type: String,
        required: true,
        default: 6969696969
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
    },
    hasCCTV: {
        type: Boolean,
        required: true,
        default: true
    },
    storeImages: [{
        type: String
    }],
    address: {
        type: String,
        default: "address1"
    },
    longAddress: {
        type: String,
        default: "address2"
    },
    ownerName: {
        type: String,
        default: "Mr_Dush__T"
    },
    ownerDetail: {
        type: String,
        default: "Mr_Dush__T was my xbox-live gamertag way back when I was in class 8"
    },
    detailedTiming: {
        monday: { open: {type: Date}, close: {type: Date} },
        tuesday: { open: {type: Date}, close: {type: Date} },
        wednesday: { open: {type: Date}, close: {type: Date} },
        thursday: { open: {type: Date}, close: {type: Date} },
        friday: { open: {type: Date}, close: {type: Date} },
        saturday: { open: {type: Date}, close: {type: Date} },
        sunday: { open: {type: Date}, close: {type: Date} },
    },
    ownerImage: {
        type: String
    },
    timings: {
        type: String,
        default: '24x7'
    },
    numOfBookings: {
        type: Number
    },
    geoLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true,
            default: [0,0]
        }
    }
})

storageSpaceSchema.index({ geoLocation: '2dsphere' })

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