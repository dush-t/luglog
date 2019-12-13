const mongoose = require('mongoose');
const Booking = require('./booking');
const { couponContextTypes } = require('../constants/couponContextTypes');
const { couponTypes } = require('../constants/couponTypes');
const { couponBenefitTypes } = require('../constants/couponBenefitTypes');

const couponSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        default: couponTypes.DISCOUNT
    },
    value: {
        type: Number,
        required: true,
        default: 0
    },
    used: {
        type: Boolean,
        required: true,
        default: false
    },
    constraints: { // json string to define the constraints
        type: String,
        required: true,
        default: '{}'
    },
    title: {
        type: String,
    },
    description: {
        type: String
    },
    code: {
        type: String,
        unique: true,
    },
    isGlobal: {     // can anyone with the coupon code use this coupon?
        type: Boolean,
        required: true,
        default: false
    },
    numUsesAllowed: {
        type: Number,
        required: true,
        default: 1
    },
    visibleGlobal: {    // If coupon is global, can it be seen in the coupons section?
        type: Boolean,
        required: true,
        default: false
    },
    expiryTime: {
        type: Date,
        // required: true,
        default: null
    },
    relatedReferral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Referral',
        // required: true,
        default: null
    },
    maxBenefitValue: {
        type: Number,
        default: null
    },
    benefitType: {
        type: String,
        required: true,
        default: couponBenefitTypes.PERCENTAGE
    }
}, {
    timestamps: true,
    autoIndex: false
})

couponSchema.index({ isGlobal: 1, visibleGlobal: 1})

const compareType = (type, value, valueToCompare) => {
    switch(type) {
        case 'greaterThan': return value > valueToCompare;
        case 'lessThan': return value < valueToCompare;
        case 'equalTo':
            if (value instanceof Object) {  // if an object is to be compared, compared it's _id instead.
                return valueToCompare.some(v => value._id.equals(v.toString()));
            } else {
                console.log(value.toString());
                console.log(valueToCompare.toString());
                return valueToCompare.toString() === value.toString();
            }
    }
}

const checkConstraints = (context, constraint) => {
    let trail = '';
    let numRuns = 0;
    const MAX_NUMRUNS = 15

    /*
            Check every key in context at a given level. If the key's value
            is an object that contains the key 'type', check against the
            constraint. Otherwise, call the function again with context[key]
            and constraint[key] as arguments, thus recursively checking every
            level
    */
    const parseConstraint = (context, constraint) => {
        numRuns++;
        if (numRuns >= MAX_NUMRUNS) {
            return numRuns;
        }
        const fields = Object.keys(constraint);
        
        let constraintPassed = fields.every((field) => {
            if (!Object.keys(context).includes(field)) {
                trail = context['paperTrail'] + `>${field}`
                return false
            }
            context[field]['paperTrail'] = context.paperTrail + `>${field}`;

            if (constraint[field].type) {
                const value = compareType(constraint[field].type, context[field], constraint[field].valueToCompare);
                if (!value) {
                    trail = context['paperTrail'] + `>${field}`
                    return false
                }
                return true
            } else {
                return parseConstraint(context[field], constraint[field]);
            }
        })
        return constraintPassed;
    }

    if (numRuns >= MAX_NUMRUNS) {
        return {
            passed: undefined,
            trail: trail,
            error: 'RECURSION_DEPTH_EXCEEDED',
        }
    }
    const passed = parseConstraint(context, constraint);
    return {
        passed: passed, 
        trail: trail,
        error: undefined
    }
}


couponSchema.methods.numberOfUsesBy = function (customer) {
    let numberOfUses = 0;
    customer.bookings.forEach((booking) => {
        if ((booking.couponUsed) && (this._id.equals(booking.couponUsed)) && booking.transaction) {
            if (booking.transaction.status === 'COMPLETE') {
                numberOfUses++;
            }
        }
    });
    console.log("Number of coupon uses:", numberOfUses);
    return numberOfUses;
}


couponSchema.methods.expired = function () {
    return this.expiryTime === null ? false : (new Date) > this.expiryTime;
}

/*
    Populate all fields of customer and the customer's bookings
    before putting it into the context object for this function.
    This is done to reduce the number of database calls. Fucks
    the modularity, but keeps the code kinda optimized.
    I am too inexperienced to 
*/
couponSchema.methods.checkApplicability = function (context) {
    const coupon = this;
    const constraints = JSON.parse(coupon.constraints);
    // console.log(constraints);

    // Check if constraints are satisfied
    const constraintsCheck = checkConstraints(context, constraints);
    // console.log(constraintsCheck);
    if (!constraintsCheck.passed) {
        return {
            ...constraintsCheck,
            error: 'CONSTRAINT_FAILED'
        };
    };

    if (context.type === couponContextTypes.CUSTOMER_CLOAKROOM_BOOKING) {
        let numberOfUses = coupon.numberOfUsesBy(context.customer);
        if (numberOfUses >= coupon.numUsesAllowed || coupon.expired()) {
            return {
                passed: false,
                trail: '',
                error: 'USE_LIMIT_EXCEEDED'
            }
        }
    }

    return {
        passed: true,
        trail: '',
        error: undefined
    }

}



const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;

/*
    CONSTRAINT SAMPLE BODY: 
    {
        booking: {
            field1: {
                type: greaterThan | lessThan | equalTo : required, (equalTo will have array)
                valueToCompare: string | number | array (in case of equalTo)
            },
            field2: {
                field4: {
                    type: ...
                    valueToCompare: ...
                },
                paperTrail: 'booking > field4'
            },
            paperTrail: 'booking'
        },
        user: {
            field3: {
                type: greaterThan | lessThan | equalTo : required, (equalTo will have array)
                valueToCompare: string | number | array (in case of equalTo)
            }
        },
        paperTrail: ''
    }
*/

/*
    This is that point in my life when I'm seriously considering shifting to a 
    microservice architecture instead of this monolithic piece of mud. That
    - although the right way to do things - will take time. Which is why we're
    staying with the monolith architecture for now. When the time comes (and it will),
    I will rewrite everything as microservices. It's the kind of choice where you
    have to decide between doing things fast and doing things right, and unfortunately
    the circumstances in this case demand the former. Apologies.
*/