const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL || 'mongodb://mongo:27017/luglog', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
