// index.js creates the express server and runs it.

const express = require('express');
require('./db/mongoose'); // calling require will ensure that the file runs.

const app = express();

// log all requests to terminal, just like django.
const loggerMiddleware = (req, res, next) => {
    console.log(req.method + ' ' + req.path);
    next();
}

app.use(express.json()) // ask express to automatically parse incoming json.
app.use(loggerMiddleware);

module.exports = app;