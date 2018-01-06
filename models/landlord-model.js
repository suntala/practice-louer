const mongoose = require('mongoose')
const Autoincrement = require('mongoose-sequence')(mongoose)


const LandlordSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean
    },
    properties: []
})


LandlordSchema.plugin(AutoIncrement, { inc_field: 'id' })  //change to whatever the model is called
module.exports = mongoose.model('Landlord', LandlordSchema)  //change to whatever the model is called