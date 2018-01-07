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
// const restaurant = require('./routes/restaurant')
// const me = require('./routes/edit-restaurant')


app.use('/', home)
app.use('/landlord', landlord)
app.use('/property', property)
app.use('/renter', renter)
// app.use('/restaurant', restaurant)
// app.use('/inputform', me)


// app.get('/about', (req, res, next) => {
// 	res.render('about')
// })
// app.get('/contact', (req, res, next) => {
// 	res.render('contact')
// })
// app.get('/restaurant', (req, res, next) => {
// 	res.render('restaurant')
// })


module.exports = app