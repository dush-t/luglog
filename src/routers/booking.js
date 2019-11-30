const express = require('express');

const StorageSpace = require('../models/storageSpace');
const Booking = require('../models/booking');
const User = require('../models/user');
const Customer = require('../models/customer');
const Coupon = require('../models/coupon');
const Referral = require('../models/referral');
const Transaction = require('../models/transaction');

const { generateBookingId } = require('../utils/randomString');
const { getDays } = require('../utils/dateTime');
const { sendNewBookingNotification } = require('../utils/slack');

const auth = require('../middleware/auth');
const versionCheck = require('../middleware/versionCheck');
const adminAccess = require('../middleware/adminAccess');
// const imageUpload = require('../utils/imageUpload');

const { couponContextTypes } = require('../constants/couponContextTypes');

const router = new express.Router();


// CREATE A BOOKING
router.post('/api/bookings/:space_id/book', versionCheck, auth, async (req, res) => {
	const storageSpace = await StorageSpace.findById(req.params.space_id).populate('area');
	const customer = await Customer.findOne({ user: req.user._id }).populate({
		path: 'bookings',
		model: 'Booking',
		populate: {
			path: 'transaction',
			model: 'Transaction'
		}
	});
	let booking = new Booking();
	
	booking.storageSpace = storageSpace._id;
	booking.consumer = customer._id;
	booking.checkInTime = new Date(req.body.checkInTime.toString());
	booking.checkOutTime = new Date(req.body.checkOutTime.toString())   // req.body.checkOutTime needs to be an ISO 8601 date string.
	booking.costPerHour = storageSpace.costPerHour;
	booking.numberOfBags = parseInt(req.body.numberOfBags);
	booking.schemaVersion = 1;
	booking.bookingId = generateBookingId();
	booking.userGovtId = req.body.userGovtId;
	booking.userGovtIdType = req.body.userGovtIdType;
	booking.bookingPersonName = req.body.bookingPersonName;
	booking.numberOfDays = getDays(req.body.checkInTime.toString(), req.body.checkOutTime.toString()); 

	// Calculating the booking price.
	// Doing this here because this is temporary and I don't have a lot of time.
	const netStorageCost = booking.numberOfDays * 24 * booking.costPerHour * booking.numberOfBags;
	booking.netStorageCost = netStorageCost;
	
	let coupon = null;
	if (req.body.couponId) {
		coupon = await Coupon.findById(req.body.couponId).populate('relatedReferral');
		const context = {
			type: couponContextTypes.CUSTOMER_CLOAKROOM_BOOKING,
			booking: {
				...booking._doc,
				storageSpace: storageSpace
			},
			customer: {
				...customer._doc,   // Spreading the object itself also gives me it's prototype
				user: req.user
			}
		}

		const applicableCheck = await coupon.checkApplicability(context);
		console.log(applicableCheck);
		if (applicableCheck.passed) {
			await booking.applyCoupon(coupon, context);
		} else {
			return res.status(400).send({
				message: {
					status: "ERROR",
					level: "INFO",
					displayType: "ALERT",
					title: "Invalid Coupon",
					description: "This coupon is not applicable to this booking"
				}
			})
		}
	}

	await booking.save();

	// Ugly, but necessary for the moment
	// if (req.body.couponId && coupon.relatedReferral) {
	//     const referral = coupon.relatedReferral;
	//     await referral.handle(booking);
	// }

	// Adding the booking to the user.
	customer.isLuggageStored = true;
	customer.bookings = customer.bookings.concat(booking._id);
	customer.latestBooking = booking._id;
	await customer.save();

	res.status(201).send({...booking._doc, storageSpace: storageSpace, checkInTime: booking.checkInTime.getTime(), checkOutTime: booking.checkOutTime.getTime()});
	// sendNewBookingNotification(booking, storageSpace, req.user);
})


router.get('/api/bookings', auth, async (req, res) => {
	const bookings = await Booking.find({ consumer: req.user._id }).populate({
		path: 'storageSpace',
		model: 'StorageSpace',
		select: 'name type location longAddress storeImages',
		populate: {
			path: 'area',
			model: 'Area'
		}
	}).populate({
		path: 'consumer',
		model: 'Customer',
		select: 'name'
	}).populate({
		path: 'transaction',
		model: 'Transaction',
		select: 'status'
	})

	// Tried to somehow get valid bookings from the mongoose query itself but didn't work
	// and I'm running out of patience at this point.
	const validBookings = bookings.filter((booking) => {
		if (!booking.transaction || booking.transaction.status !== 'COMPLETE') {
			return false;
		}
		return true;
	});
	res.status(200).send(validBookings);
})


router.get('/api/booking/:booking_id', auth, async (req, res) => {
	const booking = await Booking.findById(req.params.booking_id).populate({
		path: 'storageSpace',
		model: 'StorageSpace',
		select: 'name type location longAddress storeImages',
		populate: {
			path: 'area',
			model: 'Area'
		}
	}).populate({
		path: 'consumer',
		model: 'Customer',
		select: 'name'
	}).populate({
		path: 'transaction',
		model: 'Transaction',
		select: 'status'
	})

	// If user hasn't paid for the booking yet, don't let him see it.
	if (!booking.transaction || booking.transaction.status !== 'COMPLETE') {
		return res.status(405).send({
			error: "You haven't paid for the booking yet"
		})
	}

	res.status(200).send(booking);
})


router.get('/migrateBookings', auth, adminAccess, async (req, res) => {
	const bookings = await Booking.find({});
	for (let i = 0; i < bookings.length; i++ ) {
		const booking = bookings[i];
		try{
			const user = User.findById(booking.consumer);
			const customer = Customer.findOne({ user: user._id });
			if (!customer) {
				return
			}
			booking.consumer = customer._id;
			await booking.save()
		} catch (e) {
			console.log(booking, i);
		}
	}
	return res.status(200).send(bookings);
})


module.exports = router;