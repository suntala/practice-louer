const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/prac')   //change prac to whatever name is appropriate

// mongoose.connect('mongodb://localhost/prac', { useMongoClient: true })   