const Area = require('../../models/area');
const StorageSpace = require('../../models/storageSpace');

const resolver = {
    Query: {
        async area(_, args) {
            const area = await Area.findOne(args);
            return area;
        },
        async areas() {
            const areas = await Area.find({});
            return areas
        }
    },

    Area: {
        async storageSpaces(parent) {
            const storageSpaces = StorageSpace.find({area: parent._id});
            return storageSpaces;
        }
    }
}

module.exports = resolver;