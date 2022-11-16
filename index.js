const { response, json } = require('express');
const express = require('express');
const app = express();
const cors = require('cors');
//import morgan middleware to use for logging
var morgan = require('morgan');
app.use(cors());

app.use(express.json());
morgan.token('payload', function (request, response) {return JSON.stringify(request.body)});
// Attempting to log the error message json returned under code 400 - duplicate/missing name
// Will probably have to write a middleware to parse/access response data
// morgan.token('errorMessage', function (request, response) {
//     if (response.body?.error) return JSON.stringify(response.body.error);
// });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'));

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send(`<h1>Welcome to the Phonebook!</h1>`);
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = +request.params.id;
    console.log(`fetching person of id ${id}`);
    const personToReturn = persons.find(person => person.id === id);
    
    if (!personToReturn) response.status(400).json({"error":"person not found"});

    response.json(personToReturn);
}) 

app.get('/info', (request, response) => {
    response.send(`<h1>Phonebook has info for ${persons.length} people.</h1>
    <div> 
        as of ${new Date()}
    </div>
    `);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();//.json({"message":"person has been deleted"});
})

// generates a rando integer, 1000 or under.
// regenerates int if there is a duplicate found -- may slow down program at larger scale
const generateID = () => {
    let randomInt = Math.floor((Math.random() * 1000)+1);
    while (persons.find(person => person.id === randomInt)) {
        console.log('duplicate id generated, rerolling')
        console.log('(╯°□°）╯︵ ┻━┻')
        randomInt = Math.floor((Math.random() * 1000)+1);
    } 
    console.log('generating random id #', randomInt);
    return randomInt;
}

app.post('/api/persons', (request, response) => {
    if (!request.body.name || !request.body.number) {
        console.log(response);
        return response.status(400).json({"error":"missing required attribute"});
    }
    if (persons.find(person => person.name == request.body.name)) {
        return response.status(400).json({"error":"name must be unique"});
    }

    const personToAdd = {
        id: generateID(), 
        name: request.body.name,
        number: request.body.number
    }
    // console.log(`Adding person`,personToAdd);
    persons = persons.concat(personToAdd);

    response.json(personToAdd);
})

const PORT = process.env.PORT || "8080";
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}\nLol, godspeed`)
})