const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SG_APIKEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'goluggagefree@gmail.com',
        subject: "Thanks for joining!",
        text: `Thanks for signing up, ${name}!`
    })
}

const sendBookingEmailToSpace = (email, name) => {
    sgMail.send({
        to: email,
        from: 'goluggagefree@gmail.com',
        subject: "Booking recieved",
        text: "I'm just testing stuff out right now, will figure out the content of this mail later"
    })
}

const sendBookingEmailToUser = (email, name, vendorName) => {
    sgMail.send({
        to: email,
        from: 'goluggagefree@gmail.com',
        subject: "Your booking was successful",
        text: `Hey ${name}, your booking at ${vendorName} was successful! You were supposed to get information in this email but you didn't because this is a test`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendBookingEmailToSpace,
    sendBookingEmailToUser
}