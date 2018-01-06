const express = require('express')
const bodyParse = require('body-parser')
require(`./database-connection`)

const app = express()

app.use(bodyParse.urlencoded({extended: true}));
app.use(bodyParser.json())
app.set('view engine', 'pug')

/*
const home = require('./routes/home')
const restaurant = require('./routes/restaurant')
const me = require('./routes/edit-restaurant')


app.use('/', home)
app.use('/restaurant', restaurant)
app.use('/inputform', me)


app.get('/about', (req, res, next) => {
	res.render('about')
})
app.get('/contact', (req, res, next) => {
	res.render('contact')
})
app.get('/restaurant', (req, res, next) => {
	res.render('restaurant')
})
*/

module.exports = app