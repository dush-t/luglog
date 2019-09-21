const express = require('express')

const Image = require('../models/image');

const auth = require('../middleware/auth');
const adminAccess = require('../middleware/adminAccess');

const router = new express.Router();

router.get('/media/image/:image_id', async (req, res) => {
    const image = await Image.findById(req.params.image_id)
    res.set('Content-Type', 'image/png');
    res.status(200).send(image.imageContent);
})

router.delete('/media/image/:image_id', auth, adminAccess, async (req, res) => {
    const image = await Image.findById(req.params.image_id);
    await image.remove();
    res.status(200).send();
})


module.exports = router;