const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)


const RenterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    money: {
        type: Number
    },
    months: [],
    property: []
})


RenterSchema.plugin(AutoIncrement, { inc_field: 'renterID' })  //change to whatever the model is called
module.exports = mongoose.model('Renter', RenterSchema)  //change to whatever the model is called