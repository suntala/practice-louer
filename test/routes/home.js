import test from 'ava'
import request from 'supertest'
import app from '../../app'

test('Get home page', async t => {
    const creation = (await request(app)
        .post('/'))
        .body
    
    const res = await request(app)
        .get('/')
    
    t.is(res.status, 200)
})