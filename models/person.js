const mongoose = require('mongoose')

const url = process.env.MONGODB_URI;

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => console.log('oops, error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2
    },
    number: {
        type: String,
        required: true,
        minLength: 8
    }
    // IMPLEMENT VALIDATION 
    // name: String,
    // number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)