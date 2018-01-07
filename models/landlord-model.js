const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)


const LandlordSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    money: {
        type: Number
    },
    properties: []
})


LandlordSchema.plugin(AutoIncrement, { inc_field: 'landlordID' })  //change to whatever the model is called
module.exports = mongoose.model('Landlord', LandlordSchema)  //change to whatever the model is called