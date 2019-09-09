const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const storageSpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    coordinates: {
        cX: {
            type: Number,
        },
        cY: {
            type: Number
        }
    },
    avatar: {
        type: Buffer,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    
})