const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)


const PropertySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number
    }
})


PropertySchema.plugin(AutoIncrement, { inc_field: 'propertyID' })  //change to whatever the model is called
module.exports = mongoose.model('Property', PropertySchema)  //change to whatever the model is called