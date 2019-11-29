const generateUUID = (phoneNumber) => {
    let UUID = phoneNumber.toString() + '_';
    for (i = 0; i < 8; i++) {
        UUID += Math.random().toString(36).substring(2, 15); // don't ask.
    }
    UUID = UUID.substring(0, 64);
    return UUID;
}

const generatePaytmOrderId = (phoneNumber) => {
    let orderId = phoneNumber.toString() + '_';
    for (i = 0; i < 7; i++) {
        orderId += Math.random().toString(36).substring(2, 15);
    }
    orderId = orderId.substring(0, 50);
    return orderId;
}

const generateRazorpayRecieptId = (phoneNumber) => {
    let orderId = phoneNumber.toString() + '_';
    for (i = 0; i < 2; i++) {
        orderId += Math.random().toString(36).substring(2, 15);
    }
    orderId = orderId.substring(0, 20);
    return orderId;
}

const generateBookingId = () => {
    let bookingId = '';
    for (i = 0; i < 2; i++) {
        bookingId += Math.random().toString(36).substring(2,8)
    }
    return bookingId.substring(2,8).toUpperCase();
}

const generateRandomInt = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
    
}

const generateCouponCode = () => {
    let couponCode = '';
    for (i = 0; i < 2; i++) {
        couponCode += Math.random().toString(36).substring(2,8)
    }
    return `${Date.now()}_${couponCode}`;
}

const generateCashfreeBeneId = (phoneNumber) => {
    let beneId = phoneNumber.toString() + '_';
    for (i = 0; i < 2; i++) {
        beneId += Math.random().toString(36).substring(2, 15); // don't ask.
    }
    beneId = beneId.substring(0, 15);
    return beneId;
}

const generateReferralCode = () => {
    let referralCode = '';
    for (i = 0; i < 2; i++) {
        referralCode += Math.random().toString(36).substring(2,8)
    }
    return referralCode.substring(0, 5).toUpperCase();
}

const generateCashfreeTransferId = () => {
    let transferId = '';
    for (i = 0; i < 8; i++) {
        transferId += Math.random().toString(36).substring(2,8)
    }
    return transferId.substring(0,30);
}

module.exports = {
    generateUUID,
    generatePaytmOrderId,
    generateRazorpayRecieptId,
    generateBookingId,
    generateRandomInt,
    generateCouponCode,
    generateCashfreeBeneId,
    generateReferralCode,
    generateCashfreeTransferId
}