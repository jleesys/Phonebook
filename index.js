const { response } = require('express');
const express = require('express');
const app = express();
app.use(express.json());



const persons = [
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
    response.json(personToReturn);
})

app.get('/info', (request, response) => {
    response.send(`<h1>Phonebook has info for ${persons.length} people.</h1>
    <div> 
        as of ${new Date()}
    </div>
    `);
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}\nLol, godspeed`)
})