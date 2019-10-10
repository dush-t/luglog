const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://dushyant:tlothwby0107@cluster0-j5uti.mongodb.net/luglog?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
