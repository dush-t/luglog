const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

citySchema.virtual('storageSpaces', {
    ref: 'StorageSpace',
    localField: '_id',
    foreignField: 'city'
})


const City = mongoose.model('City', citySchema);
module.exports = City;