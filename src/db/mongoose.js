const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL || "mongodb://luglogadmin:lolmao12345@0.0.0.0:27017,0.0.0.0:27018,0.0.0.0:27019/luglog?authSource=admin&replicaSet=rs0", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoReconnect: true
});
