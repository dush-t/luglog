const Customer = require('../../models/customer');
const User = require('../../models/user');

const resolver = {
    Query: {
        async customer(_, args, context) {
            if (Object.keys(args).length === 0) {
                return null
            }
            const customer = await Customer.findOne(args);
            return customer
        }
    },

    Customer: {
        async user(parent) {
            const user = await User.findById(parent.user);
            return user;
        },

        async coupons(parent) {
            return parent.coupons
        }
    }
}

module.exports = resolver;