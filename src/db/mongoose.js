const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL || "mongodb://luglogadmin:lolmao12345@mongo0:27017/luglog?authSource=admin", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
