const StorageSpace = require('../../models/storageSpace');
const User = require('../../models/user');
const Area = require('../../models/area');

const resolver = {
    Query: {
        async storageSpace(parent, args) {
            if (parent !== undefined) {
                const storageSpace = await StorageSpace.findOne({ _id: parent.storageSpace });
                return storageSpace;
            } else {
                const storageSpace = await StorageSpace.findOne({ _id: args._id });
                return storageSpace;
            }
        },

        async storageSpaces(parent, args) {

            if (args.longitude && args.latitude) {
                const targetLocation = {
                    type: "Point",
                    coordinates: [parseFloat(args.longitude), parseFloat(args.latitude)]
                }
                const storageSpaces = await StorageSpace.find({
                    geoLocation: {
                        $near: {
                            $geometry: targetLocation
                        }
                    }
                })
                return storageSpaces
            }

            const storageSpaces = await StorageSpace.find({...args});
            return storageSpaces;
        }
    },

    StorageSpace: {
        async area(parent) {
            const area = await Area.findById(parent.area);
            return area;
        }
    }
}

module.exports = resolver;