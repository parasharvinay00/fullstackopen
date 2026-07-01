const express = require('express')
const fs = require('fs/promises')
const path = require('path')
const { randomUUID } = require('crypto')

const app = express()

const PORT = process.env.PORT || 3001
const dbFile = path.join(__dirname, 'db.json')
const distPath = path.join(__dirname, 'dist')

// Allow Express to read incoming JSON
app.use(express.json())

// Read all persons from db.json
const readPersons = async () => {
  try {
    const data = await fs.readFile(dbFile, 'utf8')
    const persons = JSON.parse(data)

    return Array.isArray(persons) ? persons : []
  } catch (error) {
    // Return an empty phonebook when db.json does not exist
    if (error.code === 'ENOENT') {
      return []
    }

    throw error
  }
}

// Save all persons to db.json
const writePersons = async persons => {
  await fs.writeFile(
    dbFile,
    JSON.stringify(persons, null, 2)
  )
}

// Clean the submitted name and number
const normalizePerson = (body = {}) => ({
  name:
    typeof body.name === 'string'
      ? body.name.trim()
      : '',

  number:
    typeof body.number === 'string'
      ? body.number.trim()
      : ''
})

// Convert names into a form suitable for comparison
const normalizeName = name =>
  String(name || '').trim().toLowerCase()

// Display phonebook information
app.get('/info', async (request, response, next) => {
  try {
    const persons = await readPersons()

    response.send(`
      <p>Phonebook has info for ${persons.length} contacts</p>
      <p>${new Date()}</p>
    `)
  } catch (error) {
    next(error)
  }
})

// Return all persons
app.get('/api/persons', async (request, response, next) => {
  try {
    const persons = await readPersons()

    response.json(persons)
  } catch (error) {
    next(error)
  }
})

// Return one person
app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const persons = await readPersons()

    const person = persons.find(
      currentPerson =>
        String(currentPerson.id) === request.params.id
    )

    if (!person) {
      return response.status(404).json({
        error: 'person not found'
      })
    }

    response.json(person)
  } catch (error) {
    next(error)
  }
})

// Create a new person
app.post('/api/persons', async (request, response, next) => {
  try {
    const persons = await readPersons()
    const person = normalizePerson(request.body)

    if (!person.name || !person.number) {
      return response.status(400).json({
        error: 'name and number are required'
      })
    }

    const nameAlreadyExists = persons.some(
      currentPerson =>
        normalizeName(currentPerson.name) ===
        normalizeName(person.name)
    )

    if (nameAlreadyExists) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

    const newPerson = {
      id: randomUUID(),
      name: person.name,
      number: person.number
    }

    persons.push(newPerson)
    await writePersons(persons)

    response.status(201).json(newPerson)
  } catch (error) {
    next(error)
  }
})

// Update an existing person
app.put('/api/persons/:id', async (request, response, next) => {
  try {
    const persons = await readPersons()
    const person = normalizePerson(request.body)

    const existingPerson = persons.find(
      currentPerson =>
        String(currentPerson.id) === request.params.id
    )

    if (!existingPerson) {
      return response.status(404).json({
        error: 'person not found'
      })
    }

    if (!person.name || !person.number) {
      return response.status(400).json({
        error: 'name and number are required'
      })
    }

    const nameAlreadyExists = persons.some(
      currentPerson =>
        String(currentPerson.id) !== request.params.id &&
        normalizeName(currentPerson.name) ===
        normalizeName(person.name)
    )

    if (nameAlreadyExists) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

    const updatedPerson = {
      ...existingPerson,
      name: person.name,
      number: person.number
    }

    const updatedPersons = persons.map(currentPerson =>
      String(currentPerson.id) === request.params.id
        ? updatedPerson
        : currentPerson
    )

    await writePersons(updatedPersons)

    response.json(updatedPerson)
  } catch (error) {
    next(error)
  }
})

// Delete one person
app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    const persons = await readPersons()

    const personExists = persons.some(
      currentPerson =>
        String(currentPerson.id) === request.params.id
    )

    if (!personExists) {
      return response.status(404).json({
        error: 'person not found'
      })
    }

    const remainingPersons = persons.filter(
      currentPerson =>
        String(currentPerson.id) !== request.params.id
    )

    await writePersons(remainingPersons)

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// Handle unknown API addresses
app.use('/api', (request, response) => {
  response.status(404).json({
    error: 'unknown endpoint'
  })
})

// Serve JavaScript, CSS and other frontend files from dist
app.use(express.static(distPath))

// Return the React application for other browser GET requests
app.get(/.*/, (request, response, next) => {
  response.sendFile(
    path.join(distPath, 'index.html'),
    error => {
      if (error) {
        next(error)
      }
    }
  )
})

// Handle unexpected server errors
app.use((error, request, response, next) => {
  console.error(error.stack || error)

  response.status(500).json({
    error: 'internal server error'
  })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})