const express = require('express');
const axios = require('axios');

// MODELS
const ReferralPartner = require('../models/referralPartner');
const User = require('../models/user');
const Referral = require('../models/referral');

// MIDDLEWARE
const adminAccess = require('../middleware/adminAccess');

// UTILS
const { generateCashfreeBeneId } = require('../utils/randomString');
const { renewToken } = require('../utils/cashfree');

// CONSTANTS
const { cashfreeModeTypes } = require('../constants/cashfreeModeTypes');
const { referralTypes } = require('../constants/referralTypes');


const router = new express.Router()



router.post('/api/addReferralPartner', adminAccess, async (req, res) => {

    const userParams = {
        name: req.body.name,
        email: req.body.email,
        mobile_number: req.body.mobile_number,
        password: req.body.password,
    }
    const user = new User(userParams);
    
    const cashfreeData = {
        beneId: generateCashfreeBeneId(user.mobile_number)   
    }

    switch (req.body.cashfreeMode) {
        case cashfreeModeTypes.BANK_ACCOUNT: cashfreeData.bankAccount = req.body.bankAccount; break;
        case cashfreeModeTypes.CARD: cashfreeData.cardNo = req.body.cardNo; break;
        case cashfreeModeTypes.IFSC: cashfreeData.ifsc = req.body.ifsc; break;
        case cashfreeModeTypes.VPA: cashfreeData.vpa = req.body.vpa; break;
        default: break;
    }

    const referralPartner = new ReferralPartner({
        user: user._id,
        address: req.body.address,
        cashfreeData: {...cashfreeData}
    })

    const referral = new Referral({
        type: referralTypes.REF_PARTNER_TO_CUSTOMER,
        user: user._id,
        code: req.body.refCode
    })


    await axios.post(`${process.env.CASHFREE_BASE_URL}/payout/v1/addBeneficiary`, {
        ...cashfreeData,
        address1: req.body.address,
        name: user.name,
        email: user.email,
        phone: user.mobile_number.toString()
    }, {
        headers: {
            Authorization: `Bearer ${process.env.CASHFREE_AUTH_TOKEN}`
        }
    })
        .then(async (response) => {
            const data = response.data;
            console.log(data)
            if (data.status === 'SUCCESS') {
                await user.save();
                console.log('User saved')
                await referralPartner.save();
                console.log('referralPartner saved')
                await referral.save();
                console.log('referral saved');
            }
        })
        // .catch((response) => {
        //     const data = response.data;
        //     console.log(data);
        //     console.log('Failed to create referralPartner, error: ', data.message);
        // })
    
    return res.status(201).send({referralPartner, user});
})


module.exports = router;