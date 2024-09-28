require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.static('dist'))
app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  number: {
    type: String,
    required: true,
    minlength: 8
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
});

app.get('/api/persons/:id', async (request, response) => {
  try {
    const id = request.params.id;
    
    // Trigger 400 Bad Request for specific ID
    if (id === 'badrequest') {
      return response.status(400).json({ error: 'Bad Request: Invalid ID format' });
    }
    
    // Trigger 404 Not Found for specific ID
    if (id === 'notfound') {
      return response.status(404).json({ error: 'Person not found' });
    }
    
    // Trigger 500 Internal Server Error for specific ID
    if (id === 'servererror') {
      throw new Error('Intentional 500 Internal Server Error');
    }

    const person = await Person.findById(id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// New route to demonstrate 403 Forbidden
app.get('/api/admin', (request, response) => {
  response.status(403).json({ error: 'Forbidden: You do not have access to this resource' });
});

// New route to demonstrate 401 Unauthorized
app.get('/api/private', (request, response) => {
  response.status(401).json({ error: 'Unauthorized: Authentication required' });
});

app.use(errorHandler)

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