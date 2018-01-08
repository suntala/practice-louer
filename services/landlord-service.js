const fs = require('fs')
const LandlordModel = require('../models/landlord-model')   //change to whatever model name you have
const RenterModel = require('../models/renter-model')  
const PropertyModel = require('../models/property-model') 
const RenterService = require('./renter-service') //format?


const add = async (landlord) => {
    return LandlordModel.create(landlord)
}

const edit = async (landlordID, data) => {
    const landlord = await LandlordModel.findOne({ landlordID })
    // console.log(landlord)
    landlord.name = data.name     //landlord.name = data.name
    landlord.money = data.money
    landlord.properties = data.properties
    const newLandlord = await landlord.save();
    return newLandlord;
}

const del = async (landlordID) => {
    return LandlordModel.remove({ landlordID })
}


// const del = async (id) => {
//     return LandlordModel.remove({ id })
// }


const find = async (landlordID) => {
    return LandlordModel.findOne({ landlordID })
}

const findAll = async () => {
    return LandlordModel.find()
}

const payRent = async (landlordID, renterID, propertyID) => {
    const property = await PropertyModel.findOne({ propertyID })
    const landlord = await LandlordModel.findOne({ landlordID })
    const renter = await RenterModel.findOne({ renterID })
    // console.log(property)
    const monthRent = property.cost
    const newLandlordMoney = landlord.money + monthRent
    const newRenterMoney = renter.money - monthRent
    // console.log(newRenterMoney)
    const newLandlord = await edit(landlordID, {name: landlord.name, money: newLandlordMoney, properties: landlord.properties})
    // console.log(newLandlord)
    const newRenter = await RenterService.edit(renterID, {name: renter.name, money: newRenterMoney, months: renter.months, property: renter.property})
    return [newLandlord, newRenter]
}

const addProperty = async (landlord, property, payment) => {
    // const property = await PropertyModel.findOne({ propertyID })
    // const landlord = await find(landlordID)
    landlord.properties.push(property)
    const newProperties = landlord.properties
    const newLandlord = await edit(landlord.landlordID, {name: landlord.name, money: landlord.money - payment, properties: newProperties})
    return newLandlord
}

const addPropertyByID = async (landlordID, propertyID, payment) => {
    const property = await PropertyModel.findOne({ propertyID })
    const landlord = await find(landlordID)
    // const newProperties = landlord.properties.push(property)
    // console.log(newProperties)
    landlord.properties.push(property)
    const newProperties = landlord.properties
    // console.log(newProperties)
    const newLandlord = await edit(landlordID, {name: landlord.name, money: landlord.money - payment, properties: newProperties})
    return newLandlord
}

const removeProperty = async (landlord, property, payment) => {
    // const property = await PropertyModel.findOne({ propertyID })
    // const landlord = await find(landlordID)
    const theOneIndex = []
    for (let i = 0; i < landlord.properties.length; i++) {
        if (landlord.properties[i].name == property.name) {
            theOneIndex.push(i)
        }
    }
    // const propertyIndex = landlord.properties.indexOf(property)
    // const newProperties = landlord.properties.splice(theOneIndex[0], 1)
    landlord.properties.splice(theOneIndex[0], 1)
    const newProperties = landlord.properties
    // console.log(newProperties)
    const newLandlord = await edit(landlord.landlordID, {name: landlord.name, money: landlord.money + payment, properties: newProperties})
    return newLandlord
}

// const removeProperty = async (landlord, property, payment) => {
//     // const property = await PropertyModel.findOne({ propertyID })
//     // const landlord = await find(landlordID)
//     const theOneIndex = []
//     for (let i = 0; i < landlord.properties.length; i++) {
//         if (landlord.properties[i].name == property.name) {
//             theOneIndex.push(i)
//         }
//     }
//     const propertyIndex = landlord.properties.indexOf(property)
//     const newProperties = landlord.properties.splice(propertyIndex, 1)
//     // console.log(newProperties)
//     const newLandlord = await edit(landlord.landlordID, {name: landlord.name, money: landlord.money + payment, properties: newProperties})
//     return newLandlord
// }


const sellingProperty = async (landlordID1, landlordID2, propertyID) => {
    const buyer = await find(landlordID1);
    const seller = await find(landlordID2);
    const property = await PropertyModel.findOne({ propertyID })
    const price = property.cost * 12
    const newBuyer = await addProperty(buyer, property, price)
    const newSeller = await removeProperty(seller, property, price)
    // const newBuyer = await edit(landlordID1, {name: buyer.name, money: (buyer.money - price), properties: landlord.properties.concat([property])})
    // const newSeller = await edit(landlordID2, {name: seller.name, money: (seller.money + price), properties: })
    return [newBuyer, newSeller]
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
    add,
    edit, 
    del,
    find,
    findAll,
    payRent, 
    addPropertyByID,
    sellingProperty,
    removeProperty
}