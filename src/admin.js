const AdminBro = require('admin-bro');
const AdminBroExpressjs = require('admin-bro-expressjs');

const User = require('./models/user');
const Area = require('./models/area');
const Booking = require('./models/booking');
const StorageSpace = require('./models/storageSpace');
const Transaction = require('./models/transaction');
const Image = require('./models/image');

// SETUP ADMIN PANEL
AdminBro.registerAdapter(require('admin-bro-mongoose'))

const adminBro = new AdminBro({
    resources: [User, Area, Booking, StorageSpace, Transaction, Image],
    rootPath: '/admin',
    branding: {
        companyName: 'GoLuggageFree',
        logo: 'https://goluggagefree.com/image/hero-img-blue.png'
    }
})
const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
    authenticate: (email, password) => {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            return {email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD};
        } else {
            return null;
        }
    },
    cookiePassword: process.env.ADMIN_COOKIE_PASSWORD
})

module.exports = {
    adminRouter: router,
    rootPath: adminBro.options.rootPath
}