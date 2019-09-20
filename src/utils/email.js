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

module.exports = {
    sendWelcomeEmail
}