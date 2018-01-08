const express = require('express')
const bodyParser = require('body-parser')
require(`./database-connection`)

const app = express()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.set('view engine', 'pug')


const home = require('./routes/home')
const landlord = require('./routes/landlord')
const property = require('./routes/property')
const renter = require('./routes/renter')


app.use('/', home)
app.use('/landlord', landlord)
app.use('/property', property)
app.use('/renter', renter)


module.exports = app