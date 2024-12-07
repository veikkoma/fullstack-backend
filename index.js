const express = require('express');
const app = express();
const PORT = 3001;

// Persons from phonebook task
let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' },
];

// Enable JSON parsing for requests
app.use(express.json());

// Route to retrieve all persons
app.get('/api/persons', (_req, res) => {
  res.json(persons);
});

// add info page -  part 3.2
app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    `);
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
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
