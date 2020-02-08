const City = require('../../models/city')

const resolver = {
    Query: {
        async city(_, args) {
            const city = await City.findById(args._id).populate('areas');
            return city
        },

        async cities(_, args) {
            const cities = await City.find({...args}).populate('areas');
            return cities;
        }
    },

    City: {
        async areas(parent) {
            return parent.areas
        }
    }
}

module.exports = resolver