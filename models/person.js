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
        minLength: 9,
        validate: {
            validator: function(v) {
                // if ( (/\d{3}-\d{5,}/.test(v)) || ((/\d{2}-\d{6,}/.test(v))) ) {
                if ( (/^\d{3}-\d{5,}$/.test(v)) || ((/^\d{2}-\d{6,}$/.test(v))) ) {
                    return true;
                }
                return false;
            },
            message: props => `${props.value} is not a valid phone number! Must be at least 8 numbers, and include a dash.`
        }
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