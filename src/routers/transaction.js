const express = require('express');
const Booking = require('../models/booking');
const Transaction = require('../models/transaction');

const auth = require('../middleware/auth');

const { generatePaytmOrderId } = require('../utils/randomString');


const router = new express.Router()

router.post('/api/payFor/:booking_id', auth, async (req, res) => {
    const booking = await Booking.findById(req.params.booking_id);
    const orderId = generatePaytmOrderId(req.user.mobile_number);

    const paytmTransactionParams = {
        MID: process.env.PAYTM_MID,
        ORDER_ID: orderId,
        CUST_ID: req.user.unique_id,
        TXN_AMOUNT: booking.netStorageCost.toFixed(2),
        CHANNEL_ID: 'WAP',      // Render the payment page which is suitable for mobile devices only.
        WEBSITE: 'WEBSTAGING',
        INDUSTRY_TYPE_ID: 'Retail',
        CALLBACK_URL: process.env.PAYTM_CALLBACK_URL
    }

    const transaction = new Transaction({
        amount: booking.netStorageCost,
        user: req.user._id,
        paytmParams: JSON.stringify(paytmTransactionParams),
        paytmOrderId: 'A'
    })

    await transaction.save();   // Am I making redundant save calls?

    transaction.generateChecksum(async (err, encryptedHash) => {
        paytmTransactionParams.CHECKSUMHASH = encryptedHash;
        transaction.paytmParams = JSON.stringify(paytmTransactionParams);
        await transaction.save()
    })

    booking.transaction = transaction._id;
    await booking.save();

    res.status(201).send(paytmTransactionParams);
});


// Paytm will send info to this endpoint on transaction completion
router.post('/api/confirmPayment/', async (req, res) => {
    const transaction = await Transaction.findOne({ paytmOrderId: req.body.ORDERID });

    checksumHash = req.body.CHECKSUMHASH;
    if (transaction.verifyChecksum()) {
        transaction.status = req.body.STATUS;
        transaction.paytmTransactionId = req.body.TXNID;
        transaction.paytmBankTransactionId = req.body.BANKTXNID;
        transaction.paymentGateway = req.body.GATEWAYNAME;
        transaction.bankName = req.body.BANKNAME || 'UPI-payment';
        transaction.paytmResponseCode = req.body.RESPCODE;
        transaction.paytmResponseMessage = req.body.RESPMSG;
        await transaction.save();

        // Do socket related shit here.
        return res.status(200).send();
    } else {
        console.log(req.body);
        return res.status(500).send();
    }
})


module.exports = router;