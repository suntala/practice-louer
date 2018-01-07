const express = require('express')
const router = express.Router();
const PropertyService = require('../services/property-service') //replace with whatever service you have

router.post('/add', async (req, res, next) => {
    const property = await PropertyService.add(req.body)
    res.send(property)
})

module.exports = router;