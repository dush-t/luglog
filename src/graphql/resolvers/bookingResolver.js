const Booking = require('../../models/booking');

const resolver = {
    Query: {
        async booking(parent, args, context) {
            const booking = await Booking.findOne({ _id: args._id }).populate('storageSpace').populate('consumer');
            return booking;
        },
        async bookings(parent, args, context) {
            const bookings = await Booking.find(args).populate('storageSpace').populate('consumer');
            return bookings;
        }
    },

    Booking: {
        async storageSpace(parent) {
            return parent.storageSpace;
        },
        async consumer(parent) {
            return parent.consumer
        }
    }
}

module.exports = resolver;