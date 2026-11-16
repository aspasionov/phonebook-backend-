const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :response-time ms - :body'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  const isExisting = persons.find(p => p.name === person.name)
  if(!person.name.trim() || !person.number.trim()) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }
  if(isExisting) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const id = Math.random() * 1000000
  persons = persons.concat({ ...person, id: id.toString() })
  response.json(person)
})

app.get('/info', (request, response) => {
  response.send(`<h3>Phonebook has info for ${persons.length} people</h3>
    <p>${new Date()}</p>`)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)