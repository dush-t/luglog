const express = require('express')
const multer = require('multer')
const path = require('path')

const Image = require('../models/image');

const auth = require('../middleware/auth');
const adminAccess = require('../middleware/adminAccess');


// CONFIGURING IMAGE UPLOADS
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const imagePath = path.join(__dirname, '../../public/images');
        cb(null, imagePath);
    },
    filename: (req, file, cb) => {
        //   console.log(file);
        let filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
const upload = multer({
    storage: storage
});


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

router.post('/upload', upload.single('file'), function (req, res, next) {
    // console.log(req.file);
    if (!req.file) {
        res.status(500);
        return next(err);
    }
    res.json({
        fileUrl: `https://${process.env.HOSTNAME}/images/${req.file.filename}`
    });
})


module.exports = router;