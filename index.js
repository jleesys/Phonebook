require('dotenv').config()
const { response, json, request } = require('express');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
//import morgan middleware to use for logging
var morgan = require('morgan');
app.use(cors());
app.use(express.static('build'));


// DB SETUP
const Person = require('./models/person')

app.use(express.json());
morgan.token('payload', function (request, response) { return JSON.stringify(request.body) });
// Attempting to log the error message json returned under code 400 - duplicate/missing name
// Will probably have to write a middleware to parse/access response data
// morgan.token('errorMessage', function (request, response) {
//     if (response.body?.error) return JSON.stringify(response.body.error);
// });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'));


// let persons = [
//     {
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

app.get('/', (request, response) => {
    response.send(`<h1>Welcome to the Phonebook!</h1>`);
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    })
    // response.json(persons);
})

// CHANGE: Implement grabbing by new STRING objectID(from mongo)
app.get('/api/persons/:id', (request, response, next) => {
    const idToFind = request.params.id;
    // console.log(`fetching person of id ${idToFind}`);
    // const personToReturn = persons.find(person => person.id === id);
    const personToReturn =
        Person.findById(idToFind)
            .then(gotDoc => {
                if (gotDoc) {
                    response.json(gotDoc);
                } else {
                    response.status(404).send({ "error": "encountered error, object not found" })
                }
            })
            .catch(error => next(error))
    // .catch( => {
    //     // ADDING ERROR HANDLING MIDDLEWARE
    //     next();
    //     // response.status(400).send({ "error": "error encountered while fetching id. Check id type and content" })
    // })
})

app.get('/info', (request, response) => {
    let numPersons = 0;
    Person.find({})
        .then(listPersons => {
            numPersons = listPersons.length;
            // console.log(listPersons);
            // console.log(`num persons: `, numPersons, typeof numPersons);
            response.send(`<h1>Phonebook has info for ${numPersons} people.</h1>
    <div> 
        as of ${new Date()}
    </div>
    `);
        })
        .catch(error => {
            response.status(500).send(`Error fetching info`)
        })

})

app.delete('/api/persons/:id', (request, response, next) => {
    const idToDelete = request.params.id;
    Person.findByIdAndDelete(idToDelete)
        .then(deletedDoc => {
            if (deletedDoc) {
                console.log('INFO: Deleted doc.')
                response.status(204).end()
            } else {
                response.status(404).send({ "Error": "Could not find person." });
            }
        })
        .catch(error => {
            next(error)
        })

})

app.put('/api/persons/:id', (request, response, next) => {
    const idToPut = request.params.id;

    const note = {
        // name: request.body.name,
        number: request.body.number
    }
    Person.findByIdAndUpdate(idToPut, note, { runValidators: true, new: true })
        .then(updatedNote => {
            console.log('Putted.')
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

// generates a rando integer, 1000 or under.
// regenerates int if there is a duplicate found -- may slow down program at larger scale
// const generateID = () => {
//     let randomInt = Math.floor((Math.random() * 1000) + 1);
//     while (persons.find(person => person.id === randomInt)) {
//         console.log('duplicate id generated, rerolling')
//         console.log('(╯°□°）╯︵ ┻━┻')
//         randomInt = Math.floor((Math.random() * 1000) + 1);
//     }
//     console.log('generating random id #', randomInt);
//     return randomInt;
// }

app.post('/api/persons', (request, response, next) => {
    if (!request.body.name || !request.body.number) {
        console.log(response);
        return response.status(400).json({ "error": "missing required attribute" });
    }
    // if (persons.find(person => person.name == request.body.name)) {
    //     return response.status(400).json({"error":"name must be unique"});
    // }

    const person = new Person({
        name: request.body.name,
        number: request.body.number
    })
    // const personToAdd = {
    //     id: generateID(), 
    //     name: request.body.name,
    //     number: request.body.number
    // }
    // console.log(`Adding person`,personToAdd);
    // persons = persons.concat(personToAdd);

    person.save()
        .then(savedPerson => {
            console.log(`Person\n${savedPerson} has been saved to MongoDB`);
            response.json(savedPerson);
        })
        .catch(error => {
            next(error);
        });
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: `${error.message}` }); //"Bad request. Did not pass validation." })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}\nLol, godspeed`)
})