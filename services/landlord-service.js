const fs = require('fs')
const LandlordModel = require('../models/landlord-model')   //change to whatever model name you have

const add = async (landlord) => {
    return LandlordModel.create(landlord)
}



/*

const findAll = async () => {
    return LandlordModel.find()
}

const add = async (restaurant) => {
    return LandlordModel.create(restaurant)
}

const del = async (id) => {
    return LandlordModel.remove({ id })
}

const find = async (id) => {
    return LandlordModel.findOne({ id })
}

// const edit = async (id, data) => {
//     const resto = await RestaurantModel.findOne({ id })
//     resto.name = data.name
//     resto.status = data.status
//     resto.neighborhood = data.neighborhood
//     resto.openingHours = data.openingHours
//     resto.latitude = data.latitude
//     resto.longitude = data.longitude
//     resto.address = data.address
//     resto.website = data.website
//     const newresto = await resto.save();
//     return newresto;
// }
*/




module.exports = {
    // findAll,
    add,
    // del,
    // find,
    // // edit
}