import test from 'ava'
import request from 'supertest'
import app from '../../app'

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



// test('Add a landlord', async t => {
//     const input = {name:'Test', money: 50, properties: []}
//     // const input = [{name:'Test', money: 50, properties: []}]
//     //why did I have array brackets here?? and why doesn't it work without brackets??

//     const res = await request(app)
//         .post('/landlord/add')
//         .send(input)

//     console.log(res.body)

//     t.is(res.status, 200)
//     t.is(res.name, input.name)
//     t.is(res.money, input.money)
//     t.deepEqual(res.properties, input.properties)
// })


test('Add a landlord', async t => {
    const input = {name:'Test', money: 50, properties: []}
    // const input = [{name:'Test', money: 50, properties: []}]
    //why did I have array brackets here?? and why doesn't it work without brackets??

    const res = await request(app)
        .post('/landlord/add')
        .send(input)

    // console.log(res.body)

    t.is(res.status, 200)
    t.is(res.body.name, input.name)
    t.is(res.body.money, input.money)
    t.deepEqual(res.body.properties, input.properties)
})





test('Get indiv landlord page', async t => {
    const input = {name:'Test', money: 50, properties: []}

    // const landlord = (await request(app)
    //     .post('/landlord/add')
    //     .send(input))
    //     .body
    const landlord = (await request(app)
        .post('/landlord/add')
        .send(input))
        .body
    
    // console.log(landlord)
    // console.log(`${landlord.landlordID}`)
    // //why did landlord come in an array? find uses findOne...
    // console.log(landlord.landlordID)
    
    const res = await request(app)
        .get(`/landlord/${landlord.landlordID}`)
    
    // console.log(res.text)

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
    
    // console.log(res.body)

    const newLandlord = {landlordID: landlordCreation.landlordID, name: landlordCreation.name, money: (landlordCreation.money + input.payment), properties: [{propertyID: propertyCreation.propertyID, name:'TestP', cost: 10}]}

    // console.log(newLandlord)
    t.is(res.status, 200)
    // t.is(res.body, newLandlord)   <--will this never work because the object stored via MongoDB has the extra _id and _v fields?
    t.is(res.body.money, newLandlord.money)
    t.is(res.body.properties.length, newLandlord.properties.length)
    t.is(res.body.properties[0].name, newLandlord.properties[0].name)
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
    
    // console.log(sellerWithProperty.body)

    const input = {landlordID1: buyerCreation.landlordID, landlordID2: sellerCreation.landlordID, propertyID: propertyCreation.propertyID}

    const res = await request(app)
        .post('/landlord/sell-property')
        .send(input)
    
    console.log(res.body)
    console.log(res.body[1].properties)

    const newBuyer = {name:'TestLL', money: 380, properties: [{name:'TestP', cost: 10}]} 
    const newSeller = {name:'TestR', money: 1020, properties: []} 

    // console.log([newBuyer,newSeller])

    t.is(res.status, 200)
    // // t.deepEqual(res.body, [newBuyer,newSeller])
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
