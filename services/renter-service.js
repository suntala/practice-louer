const fs = require('fs')
const RenterModel = require('../models/renter-model')   //change to whatever model name you have

const add = (renter) => {
    return RenterModel.create(renter)
}

const edit = async (renterID, data) => {
    const renter = await RenterModel.findOne({ renterID })
    renter.name = data.name
    renter.money = data.money
    renter.months = data.months
    renter.property = data.property
    const newRenter = await renter.save();
    return newRenter;
}

const del = (renterID) => {
    return RenterModel.remove({ renterID })
}

module.exports = {
    add,
    del,
    edit
}