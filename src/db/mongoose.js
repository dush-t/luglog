const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL || "mongodb://luglogadmin:lolmao12345@mongo0:27017,mongo1:27018,mongo2:27019/luglog?authSource=admin", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoReconnect: true
});
