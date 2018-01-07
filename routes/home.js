const express = require('express')
const router = express.Router();
const LandlordService = require('../services/landlord-service') //replace with whatever service you have


router.get('/', (req, res, next) => {
    res.render('index')
});

// router.post('/', async (req, res, next) => {
//     const landlord = await LandlordService.add(req.body)
//     res.send(landlord)
// })


//add these to their own router pages
// router.post('/renter/add', async (req, res, next) => {
//     const renter = await RenterService.add(req.body)
//     res.send(renter)
// })

// router.post('/property/add', async (req, res, next) => {
//     const property = await PropertyService.add(req.body)
//     res.send(property)
// })

module.exports = router;