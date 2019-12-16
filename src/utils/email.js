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