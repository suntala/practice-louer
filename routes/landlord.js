const express = require('express')
const router = express.Router();
const LandlordService = require('../services/landlord-service') //replace with whatever service you have


router.get('/', async (req, res, next) => {
    const landlords = await LandlordService.findAll() 
    res.render('landlord', { landlords })
});


router.get('/:landlordID', async (req, res, next) => {
    const landlord = await LandlordService.find(req.params.landlordID) 
    if(!landlord){
        res.sendStatus(404);
        return
    }
    res.render('indiv-landlord', {landlord})
});


router.post('/add', async (req, res, next) => {
    const landlord = await LandlordService.add(req.body)
    res.send(landlord)
})


router.post('/sell-property', async (req, res, next) => {
    const newDetails = await LandlordService.sellingProperty(req.body.landlordID1, req.body.landlordID2, req.body.propertyID)
    res.send(newDetails)
})

router.post('/add-property', async (req, res, next) => {
    const newDetails = await LandlordService.addPropertyByID(req.body.landlordID, req.body.propertyID, req.body.payment)
    res.send(newDetails)
})

router.post('/delete', async (req, res, next) => {
    //maybe figure out how to get the proper details of the deleted person...
    const landlord = await LandlordService.find(req.body.landlordID)
    await LandlordService.del(req.body.landlordID)
    res.send(landlord)
})
//why didn't this work with del(req.body) and then in axios put the straight id, no curly brackets...?


router.post('/edit', async (req, res, next) => {
    const landlord = await LandlordService.edit(req.body.landlordID, {name: req.body.name, money: req.body.money, properties: req.body.properties})
    res.send(landlord)
})

router.post('/pay-rent', async (req, res, next) => {
    const newPartners = await LandlordService.payRent(req.body.landlordID, req.body.renterID, req.body.propertyID)
    res.send(newPartners)
})


module.exports = router;