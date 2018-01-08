const fs = require('fs')
const LandlordModel = require('../models/landlord-model')   //change to whatever model name you have
const RenterModel = require('../models/renter-model')  
const PropertyModel = require('../models/property-model') 
const RenterService = require('./renter-service') //format?


const add = (landlord) => {
    return LandlordModel.create(landlord)
}

const edit = async (landlordID, data) => {
    const landlord = await LandlordModel.findOne({ landlordID })
    if (typeof data.name !== 'undefined'){ landlord.name = data.name }     
    if (typeof data.money !== 'undefined'){ landlord.money = data.money }
    if (typeof data.properties !== 'undefined'){ landlord.properties = data.properties }
    const newLandlord = await landlord.save();
    return newLandlord;
}


// const edit = async (landlordID, data) => {
//     const landlord = await LandlordModel.findOne({ landlordID })
//     landlord.name = data.name     
//     landlord.money = data.money
//     landlord.properties = data.properties
//     const newLandlord = await landlord.save();
//     return newLandlord;
// }

const del = (landlordID) => {
    return LandlordModel.remove({ landlordID })
}



const find = (landlordID) => {
    return LandlordModel.findOne({ landlordID })
}

const findAll = () => {
    return LandlordModel.find()
}

const payRent = async (landlordID, renterID, propertyID) => {
    const property = await PropertyModel.findOne({ propertyID })
    const landlord = await LandlordModel.findOne({ landlordID })
    const renter = await RenterModel.findOne({ renterID })
    const monthRent = property.cost
    const newLandlordMoney = landlord.money + monthRent
    const newRenterMoney = renter.money - monthRent
    const newLandlord = await edit(landlordID, {name: landlord.name, money: newLandlordMoney, properties: landlord.properties})
    const newRenter = await RenterService.edit(renterID, {name: renter.name, money: newRenterMoney, months: renter.months, property: renter.property})
    return [newLandlord, newRenter]
}

const addProperty = async (landlord, property, payment) => {
    landlord.properties.push(property)
    const newProperties = landlord.properties
    const newLandlord = await edit(landlord.landlordID, {name: landlord.name, money: landlord.money - payment, properties: newProperties})
    return newLandlord
}

const addPropertyByID = async (landlordID, propertyID, payment) => {
    const property = await PropertyModel.findOne({ propertyID })
    const landlord = await find(landlordID)
    landlord.properties.push(property)
    const newProperties = landlord.properties
    const newLandlord = await edit(landlordID, {name: landlord.name, money: landlord.money - payment, properties: newProperties})
    return newLandlord
}

const removeProperty = async (landlord, property, payment) => {
    const theOneIndex = landlord.properties.findIndex(prop => prop.name == property.name)
    landlord.properties.splice(theOneIndex, 1)
    const newProperties = landlord.properties
    const newLandlord = await edit(landlord.landlordID, {name: landlord.name, money: landlord.money + payment, properties: newProperties})
    return newLandlord
}
//have this used with IDs and not the full data

// const removeProperty = async (landlord, property, payment) => {
//     let theOneIndex;
//     for (let i = 0; i < landlord.properties.length; i++) {
//         if (landlord.properties[i].name == property.name) {
//             theOneIndex = i
//             break
//         }
//     }
//     landlord.properties.splice(theOneIndex[0], 1)
//     const newProperties = landlord.properties
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
    return [newBuyer, newSeller]
}



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