// index.js creates the express server and runs it.

const express = require('express');
require('./db/mongoose'); // calling require will ensure that the file runs.

const userRouter = require('./routers/user');
const storageSpaceRouter = require('./routers/storageSpace');
const bookingRouter = require('./routers/booking');
const areaRouter = require('./routers/area');
const imageRouter = require('./routers/image');
const transactionRouter = require('./routers/transaction');

const app = express();

// log all requests to terminal, just like django.
const loggerMiddleware = (req, res, next) => {
    console.log(req.method + ' ' + req.path);
    next();
}

app.use(express.json()); // ask express to automatically parse incoming json.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array()); 

app.use(loggerMiddleware);

app.use(userRouter);
app.use(areaRouter);
app.use(storageSpaceRouter);
app.use(bookingRouter);
app.use(imageRouter);
app.use(transactionRouter);

module.exports = app;