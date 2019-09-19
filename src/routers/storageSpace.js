const express = require('express');
const Area = require('../models/area');
const StorageSpace = require('../models/storageSpace');
const Booking = require('../models/booking');

const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/api/storageSpaces/:area_id', async (req, res) => {
    const area = Area.findById(req.params.area_id);
    area.populate('storageSpaces').execPopulate();
    const storageSpaces = area.storageSpaces;
    res.status(200).send(storageSpaces);
})

router.get('/api/storageSpace/:space_id', async (req, res) => {
    const storageSpace = await StorageSpace.findById(req.params.space_id);
    res.status(200).send(storageSpace);
})






module.exports = router;