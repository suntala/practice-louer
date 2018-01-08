import test from 'ava'
import request from 'supertest'
import app from '../../app'

test('Add a renter', async t => {
    const input = {name:'Tester', money: 50, months: ['Jan'], property: ["House"]}

    const res = await request(app)
        .post('/renter/add')
        .send(input)
    
    t.is(res.status, 200)
    t.is(res.body.name, input.name)
    t.is(res.body.money, input.money) 
    t.deepEqual(res.body.months, input.months)     
    t.deepEqual(res.body.property, input.property)  
})

test('Edit a renter', async t => {
    const input = {name:'Tester', money: 50, months: ['Jan'], property: ["House"]}

    const creation = (await request(app)
        .post('/renter/add')
        .send(input))
        .body
        //why do i have to put body here?  
        // is it related to why i don't have to put creation.body.renterID?
    
    const newInput = {renterID: creation.renterID, data: {name:'Tester', money: 50, months: ['NewMonth'], property: ["House"]}}

    const res = await request(app)
        .post('/renter/edit')
        .send(newInput)

    t.is(res.status, 200)
    t.is(res.body.name, newInput.data.name)
    t.is(res.body.money, newInput.data.money) 
    t.deepEqual(res.body.months, newInput.data.months) 
    t.deepEqual(res.body.properties, newInput.data.properties) 
})

test('Delete a renter', async t => {
    const input = {name:'Tester', money: 50, months: ['Jan'], property: ["House"]}

    const creation = (await request(app)
        .post('/renter/add')
        .send(input))
        .body
    
    const del = await request(app)
        .post('/renter/delete')
        .send(creation)
        //why in class did we use .delete instead of .post('/renter/delete')
        //maybe practice that later 
        //and also doing the thing where you try to find it and want to make sure it's really gone

    t.is(del.status, 200)
})
