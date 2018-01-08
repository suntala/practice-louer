import test from 'ava'
import request from 'supertest'
import app from '../../app'

test('Add a property', async t => {
    const input = {name:'Test', cost: 10}

    const res = await request(app)
        .post('/property/add')
        .send(input)
    
    t.is(res.status, 200)
    t.is(res.body.name, input.name)
    t.is(res.body.cost, input.cost)
})