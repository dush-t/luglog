const express = require('express');

const Area = require('../models/area');

const auth = require('../middleware/auth');
const adminAccess = require('../middleware/adminAccess');

const router = new express.Router();

router.post('/api/areas', auth, adminAccess, async (req, res) => {
    const area = new Area(req.body);
    await area.save();
    res.send(area);
})

module.exports = router;