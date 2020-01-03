const Hubspot = require('hubspot');
const axios = require('axios')
const { hubspotDealStages } = require('../constants/hubspotDealStages')

const hubspot = new Hubspot({
    apiKey: process.env.HUBSPOT_API_KEY,
    checkLimit: false
})

const createHubspotContact = async (user) => {
    console.log('Creating hubspot contact')
    let nameParts = user.name.split(' ')
    const contactObj = {
        properties: [
            {property: 'firstname', value: nameParts[0]},
            {property: 'lastname', value: nameParts.slice(1).join(' ')},
            {property: 'email', value: user.email},
            {property: 'phone', value: `+${user.mobile_number_countryCode} ${user.mobile_number}`}
        ]
    }
    const contact = await hubspot.contacts.create(contactObj)
    console.log('Hubspot contract created')

    // console.log('contact', contact)

    const dealObj = {
        associations: {
            associatedVids: [contact.vid]
        },
        properties: {
            dealname: user.name,
            dealstage: hubspotDealStages.RAW,
            pipeline: 'default',
            dealtype: 'cloakroombooking'
        }
    }
    const deal = await createHubspotDeal(dealObj)
    return {contact, deal}
}


const updateHubspotContact = async (id, data) => {
    console.log('Updating hubspot contact')
    const propertiesArray = Object.keys(data.properties).map((propertyName) => {
        return {property: propertyName, value: data.properties[propertyName]}
    })

    const contact = await hubspot.contacts.update(id, {properties: propertiesArray})
    console.log('Hubspot contact updated')
    return contact;
}


const createHubspotDeal = async (data) => {
    console.log('Creating hubspot deal')
    const propertiesArray = Object.keys(data.properties).map((propertyName) => {
        return {name: propertyName, value: data.properties[propertyName]}
    })
    const deal = await hubspot.deals.create({associations: data.associations, properties: propertiesArray});
    console.log('Hubspot deal created')
    return deal
}

const updateHubspotDeal = async (dealId, stage, booking=null) => {
    console.log('Updating hubspot deal')
    let properties = {};
    if (stage === hubspotDealStages.INTERESTED) {
        properties = {
            amount: booking.netStorageCost,
            storage_space: booking.storageSpace.toString(),
            dealstage: stage,
            bags: parseInt(booking.numberOfBags),
            days: parseInt(booking.numberOfDays),
            checkin_time: (new Date(booking.checkInTime)).getTime(),
            checkout_time: (new Date(booking.checkOutTime)).getTime()
        }
        if (booking.couponUsed) {
            properties['coupon_referral_code_used'] = booking.couponUsed.code
        } 
    }

    properties['dealstage'] = stage;

    const propertiesArray = Object.keys(properties).map((propertyName) => {
        return {name: propertyName, value: properties[propertyName]}
    })
    const deal = await hubspot.deals.updateById(dealId, {properties: propertiesArray})
    console.log('Updated hubspot deal')
    return deal
}



// https://api.goluggagefree.com/admin/resources/Booking/records/5da4d222dd5331001742d1e5/show

module.exports = {
    createHubspotContact,
    updateHubspotContact,
    createHubspotDeal,
    updateHubspotDeal
}

// updateHubspotDeal(1369497807, hubspotDealStages.CLOSED_WON)

// const addDateTimeField = async () => {
//     const fieldObj = {
//         "name": "checkout_time",
//         "label": "Check-Out Time",
//         "description": "Time when user is supposed to take back his/her luggage from store",
//         "groupName": "glf_sales",
//         "type": "datetime",
//         "fieldType": "date",
//         "formField": true,
//         "displayOrder": 10,
//         "readOnlyValue": false,
//         "readOnlyDefinition": false,
//         "hidden": false,
//         "mutableDefinitionNotDeletable": false,
//         "calculated": false,
//         "externalOptions": false,
//         "displayMode": "current_value"
//     }

//     const resp = await hubspot.deals.properties.create(fieldObj)
//     console.log(resp)
// }

// addDateTimeField();

// vid 1101
