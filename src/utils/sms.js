const axios = require('axios');

const sendSMS = (number, body) => {
    const postData = {
        "sender": "GLFree",
        "route": "4",
        "country": "91",
        "sms": [{
            "message": body,
            "to": [
                number.toString()
            ]
        }]
    }
    
    axios.post('https://api.msg91.com/api/v2/sendsms?country=91', postData, {
        headers: {
            "authkey": process.env.SMS_AUTHKEY,
            "Content-Type": 'application/json'
        }
    })
}

module.exports = {
    sendSMS
}