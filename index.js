const { response } = require('express');
const express = require('express');
const app = express();
app.use(express.json());

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
    console.log(`Adding person`,personToAdd);
    persons = persons.concat(personToAdd);

    response.json(personToAdd);
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}\nLol, godspeed`)
})