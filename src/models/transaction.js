const mongoose = require('mongoose');
const paytmParamsStringify = require('../utils/paytmParamsStringify');
const crypt = require('../utils/crypt');

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
    paytmOrderId: {
        type: String
    },
    paytmTransactionId: {
        type: String
    },
    paytmBankTransactionId: {
        type: String
    },
    paymentGateway: {
        type: String
    },
    bankName: {
        type: String
    },
    paytmResponseCode: {
        type: String
    },
    paytmResponseMessage: {
        type: String
    },
    paytmParams: {
        type: String
    }
})

transactionSchema.virtual('booking', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'transaction'
})

//I do not like the callback pattern. Wanna change this later.
transactionSchema.methods.generateChecksum = (callback) => {
    console.log(this.paytmParams);
    const paramsJSON = JSON.parse(this.paytmParams.toString())
    const data = paytmParamsStringify(paramsJSON);
    crypt.gen_salt(4, (err, salt) => {
        const sha256 = crypto.createHash('sha256').update(data + salt).digest('hex');
        const check_sum = sha256 + salt;
        const encrypted = crypt.encrypt(check_sum, process.env.PAYTM_DEVKEY);
        callback(undefined, encrypted);
    })
}

transactionSchema.methods.verifyChecksum = () => {
    const params = JSON.stringify(this.paytmParams);
    const data = paytmParamsStringify(params);
    if (params.CHECKSUMHASH) {
        params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\n', '');
        params.CHECKSUMHASH = params.CHECKSUMHASH.replace('\r', '');

        var temp = decodeURIComponent(params.CHECKSUMHASH);
        var checksum = crypt.decrypt(temp, key);
        var salt = checksum.substr(checksum.length - 4);
        var sha256 = checksum.substr(0, checksum.length - 4);
        var hash = crypto.createHash('sha256').update(data + salt).digest('hex');
        if (hash === sha256) {
            // Successful checksum match. 
            return true;
        } else {
            // Wrong checksum.
            return false;
        }
    } else {
        // No checksum in params.
        return false;
    }
}


const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
