const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/user');

const auth = require('../middleware/auth');

const {sendWelcomeEmail} = require('../utils/email');
const {sendSMS} = require('../utils/sms');
const {generateUUID, generateRandomInt} = require('../utils/randomString');

const router = new express.Router();


router.post('/users', async (req, res) => {
    const user = new User(req.body);
    user.uniqueId = generateUUID(req.body.mobile_number);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user: user, token: token });
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
});



router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.phone_number, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user: user, token: token });
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


router.post('/users/verifyNumber', async (req, res) => {
    const otp = req.body.otp
    const number = req.body.number
    sendSMS(number.toString(), `OTP: ${otp}`);
})

router.post('/users/forgotPasswordOTP', async (req, res) => {
    const number = req.body.number;
    const OTP = generateRandomInt(10001, 99999);
    const user = await User.findOne({ mobile_number: parseInt(number) });
    user.forgotPasswordOTP = OTP;
    await user.save();
    sendSMS(number.toString(), `OTP to reset password: ${OTP}`);
    return res.send({'message': 'OTP sent to mobile number of user'});
})

router.post('/users/resetPassword', async (req, res) => {
    const otp = req.body.otp;
    const number = req.body.number;
    const password = req.body.password;
    const user = await User.findOne({ mobile_number: parseInt(number) });
    
    if (user.forgotPasswordOTP !== otp.toString()) {
        return res.status(401).send({
            message: 'Invalid OTP'
        })
    }

    user.password = password.toString();
    user.forgotPasswordOTP = '';
    await user.save();
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



module.exports = router;