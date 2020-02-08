const axios = require('axios')
const qs = require('querystring')

const getMMIAccessToken = async () => {
    console.log("called")
    const postData = qs.stringify({
        grant_type: "client_credentials",
        client_id: process.env.MMI_CLIENT_ID,
        client_secret: process.env.MMI_CLIENT_SECRET
    })
    console.log(postData)
    const options = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }

    const response = await axios.post('https://outpost.mapmyindia.com/api/security/oauth/token', postData, options)
    return response.data.access_token
}

module.exports = {
    getMMIAccessToken
}