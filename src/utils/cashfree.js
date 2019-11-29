const axios = require('axios');

const getToken = () => {
    console.log('called')
    axios.post(`${process.env.CASHFREE_BASE_URL}/payout/v1/authorize`, {}, {
        headers: {
            'X-Client-Id': process.env.CASHFREE_CLIENT_ID,
            'X-Client-Secret': process.env.CASHFREE_CLIENT_SECRET
        }
    })
        .then((response) => {
            // console.log(response)
            const data = response.data.data;
            process.env.CASHFREE_AUTH_TOKEN = data.token
            console.log('Cashfree token:', data.token)
        })
        .catch((response) => {
            console.log(response);
        })
}

// Just for better readability.
const renewToken = () => {
    getToken();
}

module.exports = {
    getToken,
    renewToken
}