const User = require('../models/user');
const express = require('express');
const axios = require('axios');

const router = new express.Router();

router.post('/addUserLog', auth, async (req, res) => {
    const user = {
        name: req.user.name,
        _id: req.user._id.toString(),
        email: req.user.email,
        phone: req.user.mobile_number
    }
    const savePointName = req.body.savePointName;
    const postData = {savePointName: savePointName, user: user};
    axios.post("http://luglog-monitor.herokuapp.com/addUserLog", postData)
        .then((response) => res.status(200).send())
        .catch((e) => res.status(500).send())
})

module.exports = router;