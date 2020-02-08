const AdminBro = require('admin-bro');
const AdminBroExpressjs = require('admin-bro-expressjs');

const User = require('./models/user');
const Area = require('./models/area');
const Booking = require('./models/booking');
const StorageSpace = require('./models/storageSpace');
const Transaction = require('./models/transaction');
const Image = require('./models/image');
const Coupon = require('./models/coupon');
const Customer = require('./models/customer');
const Referral = require('./models/referral');
const ReferralPartner = require('./models/referralPartner');
const FaqQuestion = require('./models/faqQuestion');
const City = require('./models/city');
// SETUP ADMIN PANEL
AdminBro.registerAdapter(require('admin-bro-mongoose'))

const visibleOnlyInDetail = { list: false, filter: false, show: true, edit: true }
const alwaysVisible = { list: true, filter: true, show: true, edit: true }
const invisible = { list: false, filter: false, show: false, edit: false }

const userResource = {
    resource: User,
    options: {
        properties: {
            name: {isVisible: alwaysVisible},
            email: {isVisible: alwaysVisible},
            mobile_number: {isVisible: alwaysVisible},
            bookings: {isVisible: alwaysVisible},
            uniqueId: {isVisible: visibleOnlyInDetail},
            forgotPasswordOTP: {isVisible: visibleOnlyInDetail},
            is_luggage_stored: {isVisible: invisible},
            password: {isVisible: invisible}
        }
    }
}

const storageSpaceResource = {
    resource: StorageSpace,
    options: {
        properties: {
            name: {isVisible: alwaysVisible},
            location: {isVisible: visibleOnlyInDetail},
            email: {isVisible: alwaysVisible},
            number: {isVisible: alwaysVisible},
            area: {isVisible: alwaysVisible},
            costPerHour: {isVisible: visibleOnlyInDetail},
            open: {isVisible: alwaysVisible},
            rating: {isVisible: visibleOnlyInDetail},
            hasCCTV: {isVisible: visibleOnlyInDetail},
            address: {isVisible: visibleOnlyInDetail},
            longAddress: {isVisible: visibleOnlyInDetail},
            ownerName: {isVisible: visibleOnlyInDetail},
            ownerDetail: {isVisible: visibleOnlyInDetail},
            openingTime: {isVisible: visibleOnlyInDetail},
            closingTime: {isVisible: visibleOnlyInDetail},
            timings: {isVisible: visibleOnlyInDetail}

        }
    }
}

const adminBro = new AdminBro({
    resources: [userResource, City, Area, Booking, storageSpaceResource, Transaction, Image, Coupon, Referral, Customer, ReferralPartner, FaqQuestion],
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