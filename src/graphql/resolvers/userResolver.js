const Booking = require('../../models/booking');
const User = require('../../models/user');

const resolver = {
    Query: {
        async user(_, args, context) {
            if (args.name) {
                const user = await User.findOne({ name: args.name }).populate('bookings');
                return user;
            }
            return context.currentUser;
        }
    },

    User: {
        async bookings(parent) {
            if (Object.keys(user.bookings[0]).length > 1) {
                return parent.bookings;
            }
            const bookings = await Booking.find({ consumer: parent._id })
            return bookings;
        }
    }
}

module.exports = resolver;