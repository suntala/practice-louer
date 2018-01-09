import test from 'ava'
import request from 'supertest'
import app from '../../app'


test('Get landlord page and add a landlord', async t => {
    const name1 = 'Test ' + Math.random()
    const name2 = 'Test ' + Math.random()
    await request(app).post('/landlord/add')
        .send({name: name1, money: 50, properties: []})
    await request(app).post('/landlord/add')
        .send({name: name2, money: 60, properties: []})

    const res = await request(app)
        .get('/landlord')
    
    t.is(res.status, 200)
    t.regex(res.text, new RegExp(name1))
    t.regex(res.text, new RegExp(name2))
})

test('Get indiv landlord page', async t => {
    const input = {name:'Test ' + Math.random(), money: 50, properties: []}

    const landlord = (await request(app)
        .post('/landlord/add')
        .send(input))
        .body

    // //why did landlord come in an array? find uses findOne...
    // console.log(landlord.landlordID)
    
    const res = await request(app)
        .get(`/landlord/${landlord.landlordID}`)
    
    t.is(res.status, 200)
    t.regex(res.text, new RegExp(input.name))
})

test('Add property by ID', async t => {
    const inputLandlord = {name:'TestLL', money: 500, properties: []} //buyer
    const inputProperty = {name:'TestP ' + Math.random(), cost: 10}
 
    const landlordCreation = (await request(app)
        .post('/landlord/add')
        .send(inputLandlord))
        .body

    const propertyCreation = (await request(app)
        .post('/property/add')
        .send(inputProperty))
        .body

    const res = await request(app)
        .post('/landlord/add-property')
        .send({landlordID: landlordCreation.landlordID, propertyID: propertyCreation.propertyID, payment: 0})
    
    t.is(res.status, 200)
    // t.is(res.body, newLandlord)   <--will this never work because the object stored via MongoDB has the extra _id and _v fields?
    t.is(res.body.money, landlordCreation.money)
    t.is(res.body.properties.length, 1)
    t.is(res.body.properties[0].name, inputProperty.name)
})

test('Property sale', async t => {
    const buyer = {name:'TestB', money: 500, properties: []} //buyer
    const seller = {name:'TestS', money: 900, properties: []}
    const inputProperty = {name:'TestP ' + Math.random(), cost: 10}
 
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
    
    const sellerWithProperty = await request(app)
        .post('/landlord/add-property')
        .send({landlordID: sellerCreation.landlordID, propertyID: propertyCreation.propertyID, payment: 0})
    
    const res = await request(app)
        .post('/landlord/sell-property')
        .send({landlordID1: buyerCreation.landlordID, landlordID2: sellerCreation.landlordID, propertyID: propertyCreation.propertyID})

    const [newBuyer, newSeller] = res.body

    t.is(res.status, 200)
    t.is(newBuyer.money, 380)
    t.is(newBuyer.properties.length, 1)
    t.is(newBuyer.properties[0].name, inputProperty.name)
    t.is(newSeller.money, 1020)
    t.is(newSeller.properties.length, 0)  //fix this
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

    const landlordDetailBefore = await request(app).get(`/landlord/${creation.landlordID}`)
    t.is(landlordDetailBefore.status, 200)
    
    const res = await request(app).post('/landlord/delete').send(creation)
    t.is(res.status, 200)

    const landlordDetailAfter = await request(app).get(`/landlord/${creation.landlordID}`)
    t.is(landlordDetailAfter.status, 404)
})

test('Pay rent', async t=> {
    const inputLandlord = {name:'TestLL', money: 500, properties: []} //buyer
    const inputProperty = {name:'TestP', cost: 10}
    const inputRenter = {name:'TesterR', money: 50, months: ['Jan'], property: ["House"]}
 
    const landlordCreation = (await request(app).post('/landlord/add').send(inputLandlord)).body
    const propertyCreation = (await request(app).post('/property/add').send(inputProperty)).body
    const renterCreation = (await request(app).post('/renter/add').send(inputRenter)).body

    const res = await request(app).post('/landlord/pay-rent')
        .send({landlordID: landlordCreation.landlordID, renterID: renterCreation.renterID, propertyID: propertyCreation.propertyID})
    
    t.is(res.status, 200)
})

test('Editing a landlord but not really', async t => {
    const input = {name:'Test', money: 50, properties: []}

    const creation = (await request(app)
        .post('/landlord/add')
        .send(input))
        .body
    
    // console.log(creation)
    
    const res = await request(app)
        .post('/landlord/edit')
        // .send(creation.landlordID)
        .send({landlordID: creation.landlordID})

    t.is(res.status, 200)
    t.is(res.body.name, input.name)
    t.is(res.body.money, input.money)
    t.deepEqual(res.body.properties, input.properties)
})

test('Editing a landlord', async t => {
    const input = {name:'Test ' + Math.random(), money: Math.random() * 10, properties: []}

    const creation = (await request(app).post('/landlord/add').send(input)).body

    const updateData = {landlordID: creation.landlordID, name: 'Test ' + Math.random(), money : Math.random() * 10, properties: []}
    const res = await request(app)
        .post('/landlord/edit')
        .send(updateData)

    t.is(res.status, 200)
    t.is(res.body.name, updateData.name)
    t.is(res.body.money, updateData.money)
    t.deepEqual(res.body.properties, updateData.properties)
})