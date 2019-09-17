const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true, 
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    mobile_number: {
        type: Number,
        required: true,
        unique: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Invalid mobile number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    current_city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    is_luggage_stored: {
        type: Boolean,
        required: true,
        default: false
    }
})

userSchema.virtuals('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'consumer'
});



userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || '1234');
    user.tokens = user.tokens.concat({ token: token });
    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async (mobileNo, password) => {
    const user = await User.findOne({ mobile_number: mobileNo });
    
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
















