const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

areaSchema.virtual('storageSpaces', {
    ref: 'StorageSpace',
    localField: '_id',
    foreignField: 'area'
})


const Area = mongoose.model('Area', citySchema);
module.exports = Area;