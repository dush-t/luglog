// index.js creates the express server and runs it.

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const hbs = require('hbs')
const AdminBro = require('admin-bro');
const AdminBroExpressjs = require('admin-bro-expressjs');

// SETUP SENTRY
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN })
app.use(Sentry.Handlers.requestHandler());


const upload = multer();

// OPEN DATABASE CONNECTION
require('./db/mongoose');

// IMPORT ROUTERS
const userRouter = require('./routers/user');
const storageSpaceRouter = require('./routers/storageSpace');
const bookingRouter = require('./routers/booking');
const areaRouter = require('./routers/area');
const imageRouter = require('./routers/image');
const transactionRouter = require('./routers/transaction');


// SETUP ADMIN PANEL
AdminBro.registerAdapter(require('admin-bro-mongoose'))
const adminBro = new AdminBro({
    resources: [User, Market, Stock, StockTransaction],
    rootPath: '/admin',
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


// SETUP LOGGING MIDDLEWARE
const loggerMiddleware = (req, res, next) => {
    console.log(req.method + ' ' + req.path);
    next();
}

const viewsPath = path.join(__dirname, '../templates/views');

app.set('view engine', 'hbs');
app.set('views', viewsPath);

// SETUP REQUEST-PARSING MIDDLEWARE
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array()); 

app.use(loggerMiddleware);

// USE ADMIN-PANEL
app.use(adminBro.options.rootPath, router)

app.use(userRouter);
app.use(areaRouter);
app.use(storageSpaceRouter);
app.use(bookingRouter);
app.use(imageRouter);
app.use(transactionRouter);
app.use(Sentry.Handlers.errorHandler());


module.exports = app;