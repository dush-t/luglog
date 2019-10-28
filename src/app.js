// index.js creates the express server and runs it.

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const hbs = require('hbs')

const { adminRouter, rootPath } = require('./admin');


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
app.use(rootPath, adminRouter)

app.use(userRouter);
app.use(areaRouter);
app.use(storageSpaceRouter);
app.use(bookingRouter);
app.use(imageRouter);
app.use(transactionRouter);
app.use(Sentry.Handlers.errorHandler());


module.exports = app;