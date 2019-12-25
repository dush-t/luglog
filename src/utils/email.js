const sgMail = require('@sendgrid/mail');
const { bookingConfirmationEmailStore, bookingConfirmationEmailUser, welcomeEmailBody } = require('./emailBodies')

sgMail.setApiKey(process.env.SG_APIKEY);

const sendWelcomeEmail = (email, name) => {
    const emailBody = welcomeEmailBody(name)
    sgMail.send({
        to: email,
        from: {
            email: 'support@goluggagefree.com',
            name: 'GoLuggageFree'
        },
        fromname: 'GoLuggageFree',
        subject: "Thanks for joining!",
        html: emailBody,
        bcc: ["shrey.glf@gmail.com", "dushyantvsmessi@gmail.com"]
    })
}

const sendBookingEmailToSpace = (email, bodyData) => {
    const emailBody = bookingConfirmationEmailStore(bodyData.storageSpace, bodyData.booking, bodyData.user)
    sgMail.send({
        to: email,
        from: {
            email: 'support@goluggagefree.com',
            name: 'GoLuggageFree'
        },
        subject: "Booking recieved",
        html: emailBody
    })
}

const sendBookingEmailToUser = (email, bodyData) => {
    const emailBody = bookingConfirmationEmailUser(bodyData.storageSpace, bodyData.booking, bodyData.user)
    sgMail.send({
        to: email,
        from: {
            email: 'support@goluggagefree.com',
            name: 'GoLuggageFree'
        },
        subject: "Your booking was successful",
        html: emailBody
    })
}

module.exports = {
    sendWelcomeEmail,
    sendBookingEmailToSpace,
    sendBookingEmailToUser
}

// https://goluggagefree.com/static/media/hero-img-blue.d5bcd689.png

// const emailBody = welcomeEmailBody('Dushyant Yadav')
// sgMail.send({
//     to: 'dushyant9309@gmail.com',
//     from: {
//         email: 'support@goluggagefree.com',
//         name: 'GoLuggageFree'
//     },
//     subject: "Thanks for joining!",
//     html: emailBody,
//     bcc: ["shrey.glf@gmail.com", "dushyantvsmessi@gmail.com"]
// })