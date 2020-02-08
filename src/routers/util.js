const express = require('express')

const auth = require('../middleware/auth')
const { getMMIAccessToken } = require('../utils/mapMyIndia')

const router = new express.Router()

router.get('/api/getMapMyIndiaAccessToken', auth, async (req, res) => {
    const accessToken = await getMMIAccessToken()
    return res.status(200).send({accessToken: accessToken})
})

module.exports = router