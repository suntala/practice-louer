const express = require('express')
const router = express.Router();
const LandlordService = require('../services/landlord-service') //replace with whatever service you have


router.get('/', (req, res, next) => {
    res.render('index')
});


module.exports = router;