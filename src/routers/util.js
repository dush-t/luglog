const express = require('express')

const Referral = require('../models/referral')

const auth = require('../middleware/auth')
const { getMMIAccessToken } = require('../utils/mapMyIndia')

const router = new express.Router()

router.get('/api/getMapMyIndiaAccessToken', auth, async (req, res) => {
    const accessToken = await getMMIAccessToken()
    return res.status(200).send({accessToken: accessToken})
})

router.get('/migrate', auth, async (req, res) => {
    const referrals = await Referral.find({})
    for (let i = 0; i < referrals.length; i++) {
        await referrals[i].save()
    }
    res.send(referrals)
})

module.exports = router