const StorageSpace = require('../../models/storageSpace');
const User = require('../../models/user');
const Area = require('../../models/area');

const resolver = {
    Query: {
        async storageSpace(parent, args) {
            if (parent._id) {
                const storageSpace = await StorageSpace.findOne({ _id: parent.storageSpace }).populate('area').execPopulate();
                return storageSpace;
            } else {
                const storageSpace = await StorageSpace.findOne({ _id: args._id }).populate('area').execPopulate();
                return storageSpace;
            }
        },

        async storageSpaces(parent, args) {
            const storageSpaces = await StorageSpace.find(args).populate('area').execPopulate();
            return storageSpaces;
        }
    }
}

module.exports = resolver;