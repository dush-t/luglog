const mongoose = require('mongoose');

const connectWithRetry = () => {
    try {
        return mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            autoReconnect: true
        });
    } catch (e) {
        setTimeout(connectWithRetry, 5000)
    }
}

connectWithRetry();