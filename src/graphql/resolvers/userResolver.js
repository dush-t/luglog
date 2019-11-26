const Booking = require('../../models/booking');
const User = require('../../models/user');
const Customer = require('../../models/customer');

const resolver = {
    Query: {
        async user(_, args, context) {
            if (args.name) {
                const user = await User.findOne({ name: args.name });
                return user;
            }
            return context.currentUser;
        }
    },

    User: {
        async customer(parent) {
            if (parent.type === 'CUSTOMER') {
                const customer = Customer.findOne({ user: parent._id })
                return customer;
            }
            return null
        }
    }
}

module.exports = resolver;