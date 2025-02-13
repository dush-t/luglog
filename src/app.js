// index.js creates the express server and runs it.
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const multer = require('multer');
const path = require('path');
const hbs = require('hbs');
const cors = require('cors'); // no harm, for now

// const { getToken } = require('./utils/cashfree');
// getToken();

// For authentication in graphql
const User = require('./models/user');

// SETUP GRAPHQL
const { ApolloServer, gql, graphiqlExpress } = require('apollo-server-express');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');

const graphqlServer = new ApolloServer({
    typeDefs, 
    resolvers, 
    introspection: true, 
    playground: true,
    context: async ({ req }) => {
        let authToken = null;
        let currentUser = null;
        try {
            authToken = req.header('Authorization').replace('Bearer', '');
            currentUser = await User.findByToken(authToken);
        } catch (e) {
        }
        return {
            authToken,
            currentUser
        }
    }
});


// SETUP MEDIA DIRECTORY
if (process.env.PRODUCTION_MODE) {
    app.use(express.static('public'))
} else {
    const mediaDir = path.join(__dirname, '../public');
    app.use(express.static(mediaDir));
}


// SETUP SENTRY
const Sentry = require('@sentry/node');
Sentry.init({ 
    dsn: process.env.SENTRY_DSN,
    release: process.env.SENTRY_PROJECT_VERSION
})
console.log('On version', process.env.SENTRY_PROJECT_VERSION);
app.use(Sentry.Handlers.requestHandler());


// const upload = multer();

// OPEN DATABASE CONNECTION
require('./db/mongoose');
const { adminRouter, rootPath } = require('./admin');

// IMPORT ROUTERS
const userRouter = require('./routers/user');
const storageSpaceRouter = require('./routers/storageSpace');
const bookingRouter = require('./routers/booking');
const areaRouter = require('./routers/area');
const imageRouter = require('./routers/image');
const transactionRouter = require('./routers/transaction');
const couponRouter = require('./routers/coupon');
const loggingRouter = require('./routers/logging');
const referralPartnerRouter = require('./routers/referralPartner');
const utilRouter = require('./routers/util');


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
// app.use(upload.array()); 

// SETUP CORS MIDDLEWARE
app.use(cors());

app.use(loggerMiddleware);

// USE ADMIN-PANEL
app.use(rootPath, adminRouter)

app.use(userRouter);
app.use(areaRouter);
app.use(storageSpaceRouter);
app.use(bookingRouter);
app.use(imageRouter);
app.use(transactionRouter);
app.use(couponRouter);
app.use(referralPartnerRouter);
app.use(utilRouter);
app.use(Sentry.Handlers.errorHandler());
app.use(loggingRouter);

graphqlServer.applyMiddleware({ app });
module.exports = app;