const express = require('express');
const sharp = require('sharp');
const StorageSpace = require('../models/storageSpace');
const Booking = require('../models/booking');

const { sendBookingEmailToSpace, sendBookingEmailToUser } = require('../utils/email');

const auth = require('../middleware/auth');
// const imageUpload = require('../utils/imageUpload');

const router = new express.Router();


// CREATE A BOOKING
router.post('/api/bookings/:space_id/book', auth, async (req, res) => {
    const storageSpace = await StorageSpace.findById(req.params.space_id);
    let booking = new Booking();
    
    booking.storageSpace = storageSpace._id;
    booking.consumer = req.user._id;
    booking.checkInTime = new Date(req.body.checkInTime.toString());
    booking.checkOutTime = new Date(req.body.checkOutTime.toString())   // req.body.checkOutTime needs to be an ISO 8601 date string.
    booking.costPerHour = storageSpace.costPerHour;
    booking.numberOfBags = parseInt(req.body.numberOfBags);
    booking.schemaVersion = 1;

    // Calculating the booking price.
    // Doing this here because this is temporary and I don't have a lot of time.
    const timeDelta = (booking.checkOutTime.getTime() - booking.checkInTime.getTime()) / 1000
    const netStorageCost = ((booking.costPerHour / 3600) * timeDelta) * booking.numberOfBags;
    booking.netStorageCost = netStorageCost;
    await booking.save();

    // Adding the booking to the user.
    req.user.is_luggage_stored = true;
    req.user.bookings.push(booking._id);
    await req.user.save();

    sendBookingEmailToSpace(storageSpace.email, storageSpace.name);
    sendBookingEmailToUser(req.user.email, req.user.name, storageSpace.name);

    return res.status(201).send(booking);
})


router.get('/api/bookings', auth, async (req, res) => {
    const user = await User.findById(req.user._id).populate({       // I'm ashamed of this.
        path: 'bookings',
        model: 'Booking',
        populate: {
            path: 'storageSpace',
            model: 'StorageSpace'
        }
    })
    res.status(200).send(user.bookings);
})


// //UPLOAD IMAGES FOR BOOKING
// router.post('/api/bookings/:booking_id/uploadImages', auth, imageUpload.single('luggageItem'), async (req, res) => {
//     let booking = await Booking.findById(req.params.booking_id);
//     const buffer = await WaveShaperNode(req.file.buffer).resize({ width: 300, height: 300 }).png().toBuffer();
//     booking.luggageItems.push({ photo: buffer, totalStorageCost: 0 });
//     await booking.save()
// })


module.exports = router;