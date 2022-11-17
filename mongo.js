const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the proper arguments.');
    console.log('Goodbye');
    process.exit(1);
}

const password = process.argv[2];
const personName = process.argv[3];
const personNumber = process.argv[4];

const url = `mongodb+srv://advent:${password}@cluster0.j3mn3gt.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    "name": String,
    "number": String,
    "id": Number
})

const Person = mongoose.model('Person', personSchema);

mongoose
    .connect(url)
    .then(result => {
        if (process.argv.length > 3) {
            const person = new Person({
                "name": personName,
                "id": 13,
                "number": personNumber
            })
            console.log('saving person')
            return person.save();
        }
        return Person.find({})
            .then(persons => {
                persons.forEach(person => {
                    console.log(person);
                })
            })
    })
    .then(result => {
        console.log('person saved')
        console.log(result)
        return mongoose.connection.close();
    })