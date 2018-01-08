const express = require('express')
const router = express.Router();
const RenterService = require('../services/renter-service') //replace with whatever service you have (2)

router.post('/add', async (req, res, next) => {
    const renter = await RenterService.add(req.body)
    res.send(renter)
})

router.post('/delete', async (req, res, next) => {
    const renter = await RenterService.del(req.body.renterID)
    res.send(renter)
})

router.post('/edit', async (req, res, next) => {
    const renter = await RenterService.edit(req.body.renterID, req.body.data)
    res.send(renter)
})

module.exports = router;
