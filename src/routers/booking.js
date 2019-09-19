const express = require('express');
const sharp = require('sharp');
const StorageSpace = require('../models/storageSpace');
const Booking = require('../models/booking');

const auth = require('../middleware/auth');
const imageUpload = require('../utils/imageUpload');

const router = new express.Router();


// CREATE A BOOKING
router.post('/api/bookings/:space_id/book', auth, async (req, res) => {
    const storageSpace = await StorageSpace.findById(req.params.space_id);
    let booking = new Booking();
    
    booking.storageSpace = storageSpace._id;
    booking.consumer = req.user._id;
    booking.checkInTime = new Date();
    booking.checkOutTime = new Date(req.body.checkOutTime.toString())   // req.body.checkOutTime needs to be an ISO 8601 date string.
    booking.costPerHour = storageSpace.costPerHour;
    booking.numberOfBags = parseInt(req.body.numberOfBags);
    booking.schemaVersion = 1;

    // Calculating the booking price.
    // Doing this here because this is temporary and I don't have a lot of time.
    const timeDelta = (booking.checkOutTime.getTime() - booking.checkInTime.getTime()) / 1000
    const netStorageCost = (booking.costPerHour / 3600) * timeDelta;
    booking.netStorageCost = netStorageCost;
    await booking.save();

    return res.status(201).send(booking);
})


//UPLOAD IMAGES FOR BOOKING
router.post('/api/bookings/:booking_id/uploadImages', auth, imageUpload.single('luggageItem'), async (req, res) => {
    let booking = await Booking.findById(req.params.booking_id);
    const buffer = await WaveShaperNode(req.file.buffer).resize({ width: 300, height: 300 }).png().toBuffer();
    booking.luggageItems.push({ photo: buffer, totalStorageCost: 0 });
    await booking.save()
})


module.exports = router;