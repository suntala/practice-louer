import test from 'ava'
import request from 'supertest'
import app from '../../app'

const LandlordModel = require('../../models/landlord-model')   //change to whatever model name you have
const RenterModel = require('../../models/renter-model')  
const PropertyModel = require('../../models/property-model') 
const RenterService = require('../../services/renter-service') //format?
const LandlordService = require('../../services/landlord-service')

test('Get landlord page', async t => {
    const input = {name:'Test', money: 50, properties: []}

    const landlord = (await request(app)
        .post('/landlord/add')
        .send(input))
        .body  

    const res = await request(app)
        .get('/landlord')
    
    t.is(res.status, 200)
    t.regex(res.text, /Test/)
})




test('Add a landlord', async t => {
    const input = {name:'Test', money: 50, properties: []}
    // const input = [{name:'Test', money: 50, properties: []}]
    //why did I have array brackets here?? and why doesn't it work without brackets??

    const res = await request(app)
        .post('/landlord/add')
        .send(input)

    t.is(res.status, 200)
    t.is(res.body.name, input.name)
    t.is(res.body.money, input.money)
    t.deepEqual(res.body.properties, input.properties)
})


test('Get indiv landlord page', async t => {
    const input = {name:'Test', money: 50, properties: []}

    const landlord = (await request(app)
        .post('/landlord/add')
        .send(input))
        .body

    // //why did landlord come in an array? find uses findOne...
    // console.log(landlord.landlordID)
    
    const res = await request(app)
        .get(`/landlord/${landlord.landlordID}`)
    
    t.is(res.status, 200)
    t.regex(res.text, /Test/)
})

test('Add property by ID', async t => {
    const inputLandlord = {name:'TestLL', money: 500, properties: []} //buyer
    const inputProperty = {name:'TestP', cost: 10}
 
    const landlordCreation = (await request(app)
        .post('/landlord/add')
        .send(inputLandlord))
        .body

    const propertyCreation = (await request(app)
        .post('/property/add')
        .send(inputProperty))
        .body

    const input = {landlordID: landlordCreation.landlordID, propertyID: propertyCreation.propertyID, payment: 0}

    const res = await request(app)
        .post('/landlord/add-property')
        .send(input)
    
    const newLandlord = {landlordID: landlordCreation.landlordID, name: landlordCreation.name, money: (landlordCreation.money + input.payment), properties: [{propertyID: propertyCreation.propertyID, name:'TestP', cost: 10}]}

    t.is(res.status, 200)
    // t.is(res.body, newLandlord)   <--will this never work because the object stored via MongoDB has the extra _id and _v fields?
    t.is(res.body.money, newLandlord.money)
    t.is(res.body.properties.length, newLandlord.properties.length)
    t.is(res.body.properties[0].name, newLandlord.properties[0].name)
})

test('Remove property', async t => {
    const inputLandlord = {name:'TestLLR', money: 500, properties: []} 
    const inputProperty = {name:'TestP', cost: 10}
 
    const landlordCreation = (await request(app)
        .post('/landlord/add')
        .send(inputLandlord))
        .body

    const propertyCreation = (await request(app)
        .post('/property/add')
        .send(inputProperty))
        .body

    const inputAdding = {landlordID: landlordCreation.landlordID, propertyID: propertyCreation.propertyID, payment: 0}

    const sellerWithProperty = (await request(app)
        .post('/landlord/add-property')
        .send(inputAdding))
        .body
    
    t.is(sellerWithProperty.properties.length, 1)

    const input = {landlord: sellerWithProperty, property: propertyCreation, payment: 0}

    const res = await request(app)
        .post('/landlord/remove-property')
        .send(input)

    const newLandlord = {landlordID: sellerWithProperty.landlordID, name: sellerWithProperty.name, money: (sellerWithProperty.money + input.payment), properties: []}

    t.is(res.status, 200)
    // t.is(res.body, newLandlord)   <--will this never work because the object stored via MongoDB has the extra _id and _v fields?
    t.is(res.body.money, newLandlord.money)
    t.is(res.body.properties.length, newLandlord.properties.length)
})


test('Property sale', async t => {
    const buyer = {name:'TestB', money: 500, properties: []} //buyer
    const seller = {name:'TestS', money: 900, properties: []}
    const inputProperty = {name:'TestP', cost: 10}
 
    const buyerCreation = (await request(app)
        .post('/landlord/add')
        .send(buyer))
        .body

    const sellerCreation = (await request(app)
        .post('/landlord/add')
        .send(seller))
        .body

    const propertyCreation = (await request(app)
        .post('/property/add')
        .send(inputProperty))
        .body
    
    const inputAdding = {landlordID: sellerCreation.landlordID, propertyID: propertyCreation.propertyID, payment: 0}

    const sellerWithProperty = await request(app)
        .post('/landlord/add-property')
        .send(inputAdding)
    
    const input = {landlordID1: buyerCreation.landlordID, landlordID2: sellerCreation.landlordID, propertyID: propertyCreation.propertyID}

    const res = await request(app)
        .post('/landlord/sell-property')
        .send(input)

    const newBuyer = {name:'TestLL', money: 380, properties: [{name:'TestP', cost: 10}]} 
    const newSeller = {name:'TestR', money: 1020, properties: []} 

    t.is(res.status, 200)
    t.is(res.body[0].money, 380)
    t.is(res.body[1].money, 1020)
    t.is(res.body[0].properties.length, 1)
    t.is(res.body[1].properties.length, 0)  //fix this
})

//////// BEFORE ///////////////////
// [ { properties: [ [Object] ],
//     _id: '5a53617a5e748211ae5c8af5',
//     name: 'TestLL',
//     money: 380,
//     landlordID: 87,
//     __v: 1 },
//   { properties: [ 'House' ],
//     _id: '5a53617a5e748211ae5c8af6',
//     name: 'TestR',
//     money: 1020,
//     landlordID: 88,
//     __v: 0 } ]


// [ { name: 'TestLL', money: 380, properties: [ 'House' ] },
//   { name: 'TestR', money: 1020, properties: [] } ]

test('Delete a landlord', async t => {
    const input = {name:'Test', money: 50, properties: []}

    const creation = (await request(app)
        .post('/landlord/add')
        .send(input))
        .body

    // const fetch = await request(app)
    //     .get(`/landlord/${creation.landlordID}`)
    
    // t.is(fetch.status, 200)

    const res = await request(app)
        .post('/landlord/delete')
        .send(creation)

    t.is(res.status, 200)

    // const fetch = await request(app)
    //     .get(`/landlord/${creation.landlordID}`)
    
    // t.is(fetch.status, 404)
    /*
    const fetch = await request(app)
        .get(`/landlord/${creation.landlordID}`)

    t.is(fetch.status, 404)   --> getting 500
    */  
})

test('Pay rent', async t=> {
    const inputLandlord = {name:'TestLL', money: 500, properties: []} //buyer
    const inputProperty = {name:'TestP', cost: 10}
    const inputRenter = {name:'TesterR', money: 50, months: ['Jan'], property: ["House"]}
 
    const landlordCreation = (await request(app)
        .post('/landlord/add')
        .send(inputLandlord))
        .body
    

    const propertyCreation = (await request(app)
        .post('/property/add')
        .send(inputProperty))
        .body
    
    const renterCreation = (await request(app)
        .post('/renter/add')
        .send(inputRenter))
        .body

    const input = {landlordID: landlordCreation.landlordID, renterID: renterCreation.renterID, propertyID: propertyCreation.propertyID}
    
    // console.log(input)

    // const payRent = async (landlordID, renterID, propertyID) => {
    //     const property = await PropertyModel.findOne({ propertyID })
    //     console.log(property)
    //     const landlord = await LandlordModel.findOne({ landlordID })
    //     console.log(landlord)
    //     const renter = await RenterModel.findOne({ renterID })
    //     console.log(renter)
    //     const monthRent = property.cost
    //     const newLandlordMoney = landlord.money + monthRent
    //     const newRenterMoney = renter.money - monthRent
    //     const newLandlord = await LandlordService.edit(landlordID, {name: landlord.name, money: newLandlordMoney, properties: landlord.properties})
    //     const newRenter = await RenterService.edit(renterID, {name: renter.name, money: newRenterMoney, months: renter.months, property: renter.property})
    //     console.log([newLandlord, newRenter])
    //     return [newLandlord, newRenter]
    // }

    // payRent(input.landlordID, input.renterID, input.propertyID);

    const res = await request(app)
        .post('/landlord/pay-rent')
        .send(input)
    
    t.is(res.status, 200)
})