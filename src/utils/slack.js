const axios = require('axios');

const sendNewUserNotification = (user) => {
    const messageBody = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "A new user has registered!"
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "block_id": "section567",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${user.name}*\nEmail: ${user.email} \nPhone: ${user.mobile_number} \nMongoID: ${user._id.toString()}`
                }
            }
        ]
    }
    axios.post(process.env.NEW_USER_SLACK_WEBHOOK, messageBody)
        .then((response) => {
            console.log('NewUser message posted to slack.')
        })
}

const sendNewBookingNotification = (booking, storageSpace, user) => {
    const messageBody = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "A new booking was made!"
                }
            },
            {
                "type": "divider"
            },

            {
                "type": "section",
                "block_id": "section567",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*User:* \n- Name: ${user.name} \n- Email: ${user.email} \n- Mobile: ${user.mobile_number}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*StorageSpace:* \n- Name: ${storageSpace.name}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*Details:* \n- Number of bags: ${booking.numberOfBags} \n- Number of days: ${booking.numberOfDays} \n- Cost: ${booking.netStorageCost} \n- Check-in: ${booking.checkInTime.toLocaleDateString()} ${booking.checkInTime.toLocaleTimeString()} \n- Check-out: ${booking.checkOutTime.toLocaleDateString()} ${booking.checkOutTime.toLocaleTimeString()}\n- Booking ID: _${booking.bookingId}_`
                    }
                ]
            }
        ]
    }

    axios.post(process.env.NEW_BOOKING_SLACK_WEBHOOK, messageBody)
        .then((response) => {
            console.log('NewBooking notification sent to slack')
        })
}


const tellOurselvesWeFuckedUp = (heading, message) => {
    const messageBody = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${heading}*`
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": message
                }
            }
        ]
    }
    axios.post(process.env.WELLFUCK_SLACK_WEBHOOK, messageBody)
}


module.exports = {
    sendNewBookingNotification,
    sendNewUserNotification,
    tellOurselvesWeFuckedUp
}