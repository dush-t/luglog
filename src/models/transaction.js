const mongoose = require('mongoose');
const crypto = require('crypto')

const transactionSchema = new mongoose.Schema({
    status: {
        type: String,
        default: 'PENDING'
    },
    amount: {
        type: Number,
        default: 0
    },
    kind: {
        type: String,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    razorpayOrderId: {
        type: String
    },
    razorpayReceiptId: {
        type: String
    },
    razorPayOrderJSON: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    }
})

transactionSchema.virtual('booking', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'transaction'
})

transactionSchema.set('toObject', { virtuals: true });
transactionSchema.set('toJSON', { virtuals: true });


transactionSchema.methods.hasValidSignature = function (rpayOrderId, rpayPaymentId, rpay_signature) {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);

    hmac.update(rpayOrderId + "|" + rpayPaymentId);
    let generatedSignature = hmac.digest('hex');

    if (generatedSignature === rpay_signature) {
        console.log('Signature is valid')
        return true;
    } else {
        return false;
    }
}


const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
