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

const sendBookingEmailToSpace = (email, booking) => {
    sgMail.send({
        to: email,
        from: 'goluggagefree@gmail.com',
        subject: "Booking recieved",
        text: `New booking recieved! Booking ID is ${booking.bookingId}. The booking is from ${booking.checkInTime} to ${booking.checkOutTime} for ${booking.numberOfBags} bags`
    })

    // Notifying ourselves of some booking
    sgMail.send({
        to: 'shreyansh@goluggagefree.com',
        from: 'goluggagefree@gmail.com',
        subject: 'Booking recieved',
        text: `New booking recieved! Booking ID is ${booking.bookingId}. The booking is from ${booking.checkInTime} to ${booking.checkOutTime} for ${booking.numberOfBags} bags`
    })

    sgMail.send({
        to: 'veereshkrishna@gmail.com',
        from: 'goluggagefree@gmail.com',
        subject: 'Booking recieved',
        text: `New booking recieved! Booking ID is ${booking.bookingId}. The booking is from ${booking.checkInTime} to ${booking.checkOutTime} for ${booking.numberOfBags} bags`
    })
}

const sendBookingEmailToUser = (email, name, vendorName) => {
    sgMail.send({
        to: email,
        from: 'goluggagefree@gmail.com',
        subject: "Your booking was successful",
        text: `Hey ${name}, your booking at ${vendorName} was successful! You can drop your bags anytime between the check-in and check-out times you have chosen! GoLuggageFree!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendBookingEmailToSpace,
    sendBookingEmailToUser
}