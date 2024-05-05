require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')

const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('postData', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  } else {
    return ''
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

/* let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
] */

// GET Home page
app.get('/', (request, response) => {
  response.send('<h1>Welcome to phonebook</h1>')
})

// GET information
app.get('/info', (request, response, next) => {
  Person.find({})
    .then(people => {
      const peopleAmount = people.length
      const requestTime = new Date()

      response.send(`
        <p>Phonebook has info for ${peopleAmount} people</p>
        <p>${requestTime}<p>
      `)
    })
    .catch(error => next(error))
})

// GET all people
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(people => {
      response.json(people)
    })
    .catch(error => next(error))
})

// GET a single person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(returnedPerson => {
      if (returnedPerson) {
        response.json(returnedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// DELETE a person from persons
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      if (deletedPerson) {
        response.status(204).end()
      } else {
        response.status(404).send({ error: `No person found with ID ${request.params.id}` })
      }
    })
    .catch(error => next(error))
})

// Generate an unique ID
/* const generateId = () => {
  const id = Math.floor(Math.random() * 100_000_000)
  return id
} */

// POST a new person to persons
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// PUT request to update a person's data
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on ${PORT}`)