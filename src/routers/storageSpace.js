const express = require('express');
const Area = require('../models/area');
const StorageSpace = require('../models/storageSpace');

const auth = require('../middleware/auth');
const adminAccess = require('../middleware/adminAccess');

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

router.patch('/api/storageSpace/:space_id', auth, adminAccess, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'location', 'costPerHour', 'open', 'type', 'rating']
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