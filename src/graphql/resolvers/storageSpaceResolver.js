const StorageSpace = require('../../models/storageSpace');
const User = require('../../models/user');
const Area = require('../../models/area');

const resolver = {
    Query: {
        async storageSpace(parent, args) {
            if (parent !== undefined) {
                const storageSpace = await StorageSpace.findOne({ _id: parent.storageSpace }).populate('area');
                return storageSpace;
            } else {
                const storageSpace = await StorageSpace.findOne({ _id: args._id }).populate('area');
                return storageSpace;
            }
        },

        async storageSpaces(parent, args) {
            const storageSpaces = await StorageSpace.find(args).populate('area');
            return storageSpaces;
        }
    },

    StorageSpace: {
        async area(parent) {
            if (Object.keys(parent.area).length > 1) { // checking if area was prefetched
                return parent.area;
            }
            const area = await Area.findById(parent.area._id);
            return area;
        }
    }
}

module.exports = resolver;