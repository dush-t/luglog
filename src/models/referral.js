const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        default: 'USER_TO_USER'
    },
    referred_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})