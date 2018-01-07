const fs = require('fs')
const PropertyModel = require('../models/property-model')   //change to whatever model name you have

const add = async (property) => {
    return PropertyModel.create(property)
}


module.exports = {
    add,
}