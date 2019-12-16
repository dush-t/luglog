const { toastMessage, alertMessage } = require('../appMessage');

const validateBookingData = (bookingData) => {
    const expectedFields = [
        'checkInTime',
        'checkOutTime',
        'numberOfBags',
        'userGovtId',
        'userGovtIdType',
        'bookingPersonName'
    ]

    let valid = true;
    message = null;

    expectedFields.forEach((field) => {
        if ((bookingData[field] === undefined) || (bookingData[field] === null)) {
            valid = false;
            message = toastMessage(`Invalid form entry. You did not enter the ${field} in the form`);
            return { valid, message }
        }
    })

    if ((new Date(bookingData.checkInTime)).getTime() <= (new Date()).getTime()) {
        valid = false;
        message = toastMessage('Your check-in time cannot be before right now!')
        return { valid, message }
    }

    if ((new Date(bookingData.checkInTime)).getTime() >= (new Date(bookingData.checkOutTime)).getTime()) {
        valid = false;
        message = toastMessage('You cannot have the check-out time before the check-in time!')
        return { valid, message }
    }

    if (bookingData.numberOfBags <= 0) {
        valid = false;
        message = alertMessage('Invalid Entry', 'Number of bags must be a positive quantity. Please contact support immediately.')
        return { valid, message }
    }

    return { valid, message }
}

module.exports = validateBookingData;