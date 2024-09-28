const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let persons = [
  { id: 1, name: 'Eliaskary', number: '010-12345678' },
  { id: 2, name: 'Amin', number: '011-98765432' },
  { id: 3, name: 'El Mougy', number: '012-45678910' },
  { id: 4, name: 'Alkhouri', number: '015-11223344' },
  { id: 5, name: 'Sarwat', number: '010-56789012' },
  { id: 6, name: 'Miniesy', number: '011-99887766' },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;

// Self-ping function
const selfPing = () => {
  const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`
  fetch(url)
    .then(() => console.log('Self-ping successful'))
    .catch(err => console.error('Self-ping failed:', err))
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  
  // Start self-ping
  setInterval(selfPing, 10 * 60 * 1000) // 10 minutes
})
