const sgMail = require('@sendgrid/mail');
const { bookingConfirmationEmailStore, bookingConfirmationEmailUser } = require('./emailBodies')

sgMail.setApiKey(process.env.SG_APIKEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'support@goluggagefree.com',
        subject: "Thanks for joining!",
        text: `Thanks for signing up, ${name}!`
    })
}

const sendBookingEmailToSpace = (email, bodyData) => {
    const emailBody = bookingConfirmationEmailStore(bodyData.storageSpace, bodyData.booking, bodyData.user)
    sgMail.send({
        to: email,
        from: 'support@goluggagefree.com',
        subject: "Booking recieved",
        html: emailBody
    })
}

const sendBookingEmailToUser = (email, bodyData) => {
    const emailBody = bookingConfirmationEmailUser(bodyData.storageSpace, bodyData.booking, bodyData.user)
    sgMail.send({
        to: email,
        from: 'support@goluggagefree.com',
        subject: "Your booking was successful",
        html: emailBody
    })
}

module.exports = {
    sendWelcomeEmail,
    sendBookingEmailToSpace,
    sendBookingEmailToUser
}

// sendBookingEmailToUser("dushyant9309@gmail.com", {
//     storageSpace: {
//         name: 'TestSpace',
//         longAddress: 'LongAddress',
//         location: 'location'
//     },
//     user: {
//         name: 'Dushyant Yadav'
//     },
//     booking: {
//         bookingId: 'GS27SF',
//         userGovtId: '2018A7PS0179P',
//         numberOfDays: 2,
//         numberOfBags: 2,
//         netStorageCost: 320,
//         checkInTime: '4 pm',
//         checkOutTime: '10 pm'
//     }
// })