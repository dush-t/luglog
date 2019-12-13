const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const sendotp = require('sendotp');

const User = require('../models/user');
const Customer = require('../models/customer');
const Referral = require('../models/referral');

const auth = require('../middleware/auth');
const adminAccess = require('../middleware/adminAccess');

const {sendWelcomeEmail} = require('../utils/email');
const {sendSMS} = require('../utils/sms');
const {generateUUID, generateRandomInt, generateReferralCode} = require('../utils/randomString');
const { sendNewUserNotification, tellOurselvesWeFuckedUp } = require('../utils/slack');

const { userTypes } = require('../constants/userTypes');
const { referralTypes } = require('../constants/referralTypes');

const router = new express.Router();


router.post('/users', async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile_number: req.body.mobile_number,
            password: req.body.password,
            mobile_number_countryCode: req.body.mobile_number_countryCode,
            uniqueId: generateUUID(req.body.mobile_number)
        });

        await user.save();

        let response = {user: user}
        if (req.body.userType === userTypes.CUSTOMER) {
            const customer = new Customer({
                user: user._id,
                bookings: [],
                coupons: [],
                couponsUsed: []
            })
            
            if (req.body.referralCode) {
                const referral = await Referral.findOne({ code: req.body.referralCode })
                const coupon = await referral.generateCoupon();
                console.log(coupon)
                customer.coupons = customer.coupons.concat(coupon._id);
            }
            await customer.save();
            response.customer = customer;
            console.log('customer saved')
        }

        const referral = new Referral({
            type: referralTypes.CUSTOMER_TO_CUSTOMER,
            user: user._id,
            code: generateReferralCode()
        })
        await referral.save()

        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken()
        response.token = token
        response.referralCode = referral.code
        res.status(201).send(response)
        sendNewUserNotification(user)
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
});



router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.phone_number, req.body.password);
        console.log('user', user)
        const token = await user.generateAuthToken();
        const response = { user: user, token: token }
        if (user.type === userTypes.CUSTOMER) {
            const customer = await Customer.findOne({ user: user._id });
            response.customer = customer
        }
        console.log('type', user.type)
        res.send(response);
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
});



router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});


router.post('/users/forgotPasswordOTP', async (req, res) => {
    const number = req.body.number;
    const OTP = generateRandomInt(10001, 99999);
    const user = await User.findOne({ mobile_number: parseInt(number) });
    user.forgotPasswordOTP = OTP;
    await user.save();
    const sendOTP = new sendotp(process.env.SMS_AUTHKEY);
    sendOTP.send(number.toString(), 'GLGFre', OTP, (error, data) => {
        console.log(error);
        console.log(data);
    })
    // sendSMS(number.toString(), `OTP to reset password: ${OTP}`);
    return res.send({'message': 'OTP sent to mobile number of user'});
})

router.post('/users/verifyOTP', async (req, res) => {
    const number = req.body.number;
    const otp = req.body.otp;
    const user = await User.findOne({ mobile_number: parseInt(number) });
    if (!user.forgotPasswordOTP) {
        tellOurselvesWeFuckedUp('nullOTPExploit', `Someone tried to change ${user.name}'s (${number}) password without generating an OTP`);
        return res.status(403).send();
    }
    if (user.forgotPasswordOTP === otp.toString()) {
        return res.status(200).send({
            status: 'verified'
        })
    } else {
        return res.status(412).send({
            status: 'unverified'
        })
    }
})

router.post('/users/resetPassword', async (req, res) => {
    const otp = req.body.otp;
    const number = req.body.number;
    const password = req.body.password;
    const user = await User.findOne({ mobile_number: parseInt(number) });

    if (!user) {
        return res.status(404).send({
            message: 'Could not find user with this phone number'
        });
    }
    
    if (user.forgotPasswordOTP !== otp.toString()) {
        return res.status(401).send({
            message: 'Invalid OTP'
        });
    }

    user.password = password.toString();
    user.forgotPasswordOTP = '';
    await user.save();
    res.send({
        message: 'Password was successfully updated!'
    });
})


router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})



router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['password']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({'error': 'Invalid updates provided.'})
    }
    
    try {
        const user = req.user;
        updates.forEach((update) => {
            user[update] = req.body[update];
        });
        await user.save();
        res.send(user);
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})



router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
})



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
// take image --> resize to 250x250 --> convert to png --> save as user avatar.
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height:250 }).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
})




router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})




router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {

    }
})

router.get('/users/migrate', auth, adminAccess, async (req, res) => {
    const users = await User.find({})
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const customer = new Customer({
            user: user._id,
            bookings: user.bookings.slice(),
            isLuggageStored: user.is_luggage_stored,
            forgotPasswordOTP: '',
            coupons: []
        });
        await customer.save();
        user.type = 'CUSTOMER';
        await user.save();
        console.log(user._id, user.name, user.mobile_number);
    }
    res.send(users);
})

router.get('/users/migrateUser/:_id', auth, adminAccess, async (req, res) => {
    console.log('function called')
    const user = await User.findOne({ _id: req.params._id });
    console.log('user found')
    const customer = new Customer({
        user: user._id,
        bookings: user.bookings.slice(),
        isLuggageStored: user.is_luggage_stored,
        forgotPassword: '',
        coupons: []
    });
    await customer.save();
    console.log('customer saved')
    console.log(customer._id);
    res.send(customer)
})



module.exports = router;