const express = require('express')
const mongoose = require('mongoose')

const app = express()

// Allows Express to read JSON sent in request bodies.
app.use(express.json())

// Read the MongoDB password from the terminal command.
const password = process.argv[2]

if (!password) {
  console.log('Give the MongoDB password as a command-line argument.')
  console.log('Example: node --watch index.js yourpassword')
  process.exit(1)
}

// Protect special characters such as @, #, / and % in the password.
const encodedPassword = encodeURIComponent(password)

// MongoDB Atlas connection address.
const url =
  `mongodb+srv://Tiro:${encodedPassword}` +
  `@clusterm9.lbrwq3c.mongodb.net/phonebookApp` +
  `?retryWrites=true&w=majority&appName=ClusterM9`


mongoose.set('strictQuery', false)

// Define the structure of a person stored in MongoDB.
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Change MongoDB's _id property into an id property for the frontend.
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
  },
})

// Mongoose automatically uses the MongoDB collection named "people".
const Person = mongoose.model('Person', personSchema)

// Homepage route.
app.get('/', (request, response) => {
  response.send('<h1>Phonebook backend is running</h1>')
})

// Display information about the phonebook.
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(personCount => {
      response.send(`
  < p > Phonebook has information for ${personCount} people</ >
    <p>${new Date()}</p>
`)
    })
    .catch(error => next(error))
})

// Fetch every person from MongoDB.
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

// Fetch one person using their MongoDB id.
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
})

// Add a new person to MongoDB.
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and number are required',
    })
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(409).json({
          error: 'name must be unique',
        })
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      })

      return person.save().then(savedPerson => {
        response.status(201).json(savedPerson)
      })
    })
    .catch(error => next(error))
})

// Update an existing person's name or number.
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const updatedPerson = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(
    request.params.id,
    updatedPerson,
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Delete a person from MongoDB.
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      if (deletedPerson) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Handles requests made to routes that do not exist.
const unknownEndpoint = (request, response) => {
  response.status(404).json({
    error: 'unknown endpoint',
  })
}

app.use(unknownEndpoint)

// Handles errors produced by Mongoose and other route operations.
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({
      error: 'malformatted id',
    })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message,
    })
  }

  next(error)
}

app.use(errorHandler)

const PORT = 3001

// Connect to MongoDB before starting the Express server.
mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} `)
    })
  })
  .catch(error => {
    console.error('error connecting to MongoDB:', error.message)
    process.exit(1)
  })