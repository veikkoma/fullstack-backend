require('dotenv').config();
const Person = require('./models/person');

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const app = express();

// Persons from phonebook task
let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' },
];

// Enable JSON parsing for requests
app.use(express.json());
app.use(cors());

// Morgan logging! 
morgan.token('post-data', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });

app.use(
  morgan(':method :url :status - :response-time ms :post-data')
  );

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Route to retrieve all persons - updated 3.13
app.get('/api/persons', (_req, res) => {
    Person.find({}).then((persons) => {
      res.json(persons);
    });
  });
  

// add info page -  part 3.2 - updated 3.13
app.get('/info', (_req, res) => {
    Person.countDocuments({}).then((count) => {
      const date = new Date();
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `);
    });
  });
  

// Route to retrieve a person by ID - part 3.3
// Can find person by id - http://localhost:3001/api/persons/2
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: 'Person not found !!' });
  }
});

// Route to delete a person by ID - part 3.4
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
  
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
  
    console.log(`Deleting: ${JSON.stringify(person)}`);
    persons = persons.filter(p => p.id !== id);
    res.status(204).end();
  });


// Route to add a new person - part 3.5 - 3.6 as well
// Can add person - http://localhost:3001/api/persons
app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
    }

    // Check if name already exists - part 3.6
    if (persons.some(person => person.name === body.name)) {
      return res.status(400).json({ error: 'name must be unique !!' });
    }

    // create a new person to mongodb
    const person = new Person({
        name: body.name,
        number: body.number,
    });

    // save person to mongodb
    person
        .save()
        .then(savedPerson => {
        res.json(savedPerson);
        })
        .catch(error => next(error)); // error catch
    });

// Handle any other requests by serving the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

// Start the server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})