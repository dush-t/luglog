const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    areas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area'
    }]
})

const City = mongoose.model('City', citySchema)
module.exports = City