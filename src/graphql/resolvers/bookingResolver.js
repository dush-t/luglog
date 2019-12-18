const Booking = require('../../models/booking');
const StorageSpace = require('../../models/storageSpace');
const Transaction = require('../../models/transaction');

const resolver = {
    Query: {
        async booking(parent, args, context) {
            const booking = await Booking.findOne({ _id: args._id });
            return {
                ...booking,
                storageSpacePopulated: true,
                consumerPopulated: true
            };
        },
        async bookings(parent, args, context) {
            const bookings = await Booking.find({...args}).populate('transaction');
            const validBookings = bookings.filter((booking) => {
                if (!booking.transaction || booking.transaction.status !== 'COMPLETE') {
                    return false;
                }
                return true;
            })            
            return validBookings;
        }
    },

    Booking: {
        async storageSpace(parent) {
            const storageSpace = await StorageSpace.findById(parent.storageSpace);
            return storageSpace;
        },
        async consumer(parent) {
            return parent.consumer
        },
        async transaction(parent) {
            if (parent.transaction) {
                await parent.populate('transaction').execPopulate();
                return parent.transaction;
            }
        }
    }
}

module.exports = resolver;