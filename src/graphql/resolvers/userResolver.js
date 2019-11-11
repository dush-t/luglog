const Booking = require('../../models/booking');
const User = require('../../models/user');

const resolver = {
    Query: {
        async user(_, args, context) {
            if (args.mobile_number) {
                const user = await User.findOne({mobile_number: parseInt(args.mobile_number)});
                return {
                    ...user,
                    mobile_number: user.mobile_number.toString()
                };
            }
            return context.currentUser;
        }
    },

    User: {
        async bookings(parent) {
            const bookings = await Booking.find({ consumer: parent._id })
            return bookings;
        }
    }
}

module.exports = resolver;