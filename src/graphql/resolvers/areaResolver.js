const Area = require('../../models/area');
const StorageSpace = require('../../models/storageSpace');

const resolver = {
    Query: {
        async area(_, args) {
            const area = await Area.findOne(args).populate('storageSpaces').execPopulate();
            return area;
        },
        async areas() {
            const areas = await Area.find({}).populate('storageSpaces').execPopulate();
        }
    },

    Area: {
        async storageSpaces(parent) {
            const storageSpaces = parent.storageSpaces;
            return storageSpaces;
        }
    }
}

module.exports = resolver;