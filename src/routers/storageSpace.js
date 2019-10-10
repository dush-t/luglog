const express = require('express');
const sharp = require('sharp');

const Area = require('../models/area');
const StorageSpace = require('../models/storageSpace');
const Image = require('../models/image');

const auth = require('../middleware/auth');
const adminAccess = require('../middleware/adminAccess');

const multer = require('multer');


const upload = multer({                 // No dest parameter provided because we
    limits: {                           // do not want to save the image in the 
        fileSize: 1000000               // filesystem. We wanna access the binary
    },                                  // data in the router function.
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please provide a jpg, jpeg or png file'));
        }

        cb(undefined, true);
    }

})

// const imageUpload = require('../utils/imageUpload');

const router = new express.Router();

router.post('/api/storageSpaces', auth, adminAccess, async (req, res) => {
    const area = await Area.findById(req.body.area);
    const storageSpace = new StorageSpace({
        ...req.body,
        area: area._id
    });
    
    try {
        await storageSpace.save();
        res.status(201).send(storageSpace);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
})

router.post('/api/storageSpace/:space_id/addImage', auth, adminAccess, upload.single('image'), async (req, res) => {
    console.log(req)
    try {
        const storageSpace = await StorageSpace.findById(req.params.space_id);
    
        const buffer = await sharp(req.file.buffer).png().toBuffer();
        const image = new Image({ imageContent: buffer });
        await image.save();
    
        storageSpace.storeImages.push(image._id);
        await storageSpace.save();
        res.status(200).send(storageSpace);
    } catch (e) {
        res.status(500).send({'error': e.toString()})
    }
})

router.post('/api/storageSpace/:space_id/uploadOwnerImage', auth, adminAccess, upload.single('ownerImage'), async (req, res) => {
    const storageSpace = await StorageSpace.findById(req.params.space_id);

    const buffer = await sharp(req.file.buffer).png().toBuffer();
    const image = new Image({ imageContent: buffer });
    await image.save()

    storageSpace.ownerImage = image._id;
    await storageSpace.save();
    res.status(200).send(storageSpace);
})


router.patch('/api/storageSpace/:space_id', auth, adminAccess, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'location', 'costPerHour', 'open', 'type', 'rating', 'hasCCTV', 'address', 'ownerName', 'ownerDetail', 'openingTime', 'closingTime', "number"]
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({'error': 'Invalid updates provided.'})
    }
    
    try {
        const storageSpace = await StorageSpace.findById(req.params.space_id);
        updates.forEach((update) => {
            storageSpace[update] = req.body[update];
        });
        await storageSpace.save();
        res.send(storageSpace);
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.get('/api/storageSpaces', async (req, res) => {
    const storageSpaces = await StorageSpace.find({}).populate('area')
    console.log(storageSpaces);
    // await storageSpaces.populate('area').execPopulate();
    res.status(200).send(storageSpaces);
})

router.get('/api/storageSpaces/:area_id', async (req, res) => {
    const area = await Area.findById(req.params.area_id);
    await area.populate('storageSpaces').execPopulate();
    const storageSpaces = area.storageSpaces;
    res.status(200).send(storageSpaces);
})

router.get('/api/storageSpace/:space_id', async (req, res) => {
    const storageSpace = await StorageSpace.findById(req.params.space_id);
    res.status(200).send(storageSpace);
})






module.exports = router;