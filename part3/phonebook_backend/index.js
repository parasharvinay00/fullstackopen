const express = require('express')
const cors = require('cors')
const fs = require('fs/promises')
const path = require('path')


const app = express()
const PORT = Number(process.env.PORT || 3001)
const dbFile = path.join(__dirname, 'db.json')
const distPath = path.join(__dirname, 'dist')

app.use(cors())
app.use(express.json())
app.use(express.static(distPath))

const readPersons = async () => {
  try {
    const raw = await fs.readFile(dbFile, 'utf8')
    const persons = JSON.parse(raw)

    return Array.isArray(persons) ? persons : []
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }

    throw error
  }
}

const writePersons = async persons => {
  await fs.writeFile(dbFile, JSON.stringify(persons, null, 2))
}

const normalizePersonInput = body => ({
  name: typeof body.name === 'string' ? body.name.trim() : '',
  number: typeof body.number === 'string' ? body.number.trim() : ''
})

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

app.get('/api/persons', async (request, response, next) => {
  try {
    response.json(await readPersons())
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const persons = await readPersons()
    const person = persons.find(currentPerson => currentPerson.id === request.params.id)

    if (!person) {
      return response.status(404).json({ error: 'person not found' })
    }

    response.json(person)
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (request, response, next) => {
  try {
    const persons = await readPersons()
    const person = normalizePersonInput(request.body)

    if (!person.name || !person.number) {
      return response.status(400).json({ error: 'name and number are required' })
    }

    const duplicate = persons.find(currentPerson =>
      currentPerson.name.trim().toLowerCase() === person.name.toLowerCase()
    )

    if (duplicate) {
      return response.status(400).json({ error: 'name must be unique' })
    }

    const newPerson = {
      id: randomUUID(),
      name: person.name,
      number: person.number
    }

    const nextPersons = persons.concat(newPerson)
    await writePersons(nextPersons)

    response.status(201).json(newPerson)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  try {
    const persons = await readPersons()
    const person = normalizePersonInput(request.body)
    const existingPerson = persons.find(currentPerson => currentPerson.id === request.params.id)

    if (!existingPerson) {
      return response.status(404).json({ error: 'person not found' })
    }

    if (!person.name || !person.number) {
      return response.status(400).json({ error: 'name and number are required' })
    }

    const duplicate = persons.find(currentPerson =>
      currentPerson.id !== request.params.id &&
      currentPerson.name.trim().toLowerCase() === person.name.toLowerCase()
    )

    if (duplicate) {
      return response.status(400).json({ error: 'name must be unique' })
    }

    const updatedPerson = {
      ...existingPerson,
      name: person.name,
      number: person.number
    }

    await writePersons(
      persons.map(currentPerson =>
        currentPerson.id === request.params.id ? updatedPerson : currentPerson
      )
    )

    response.json(updatedPerson)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    const persons = await readPersons()
    const personExists = persons.some(currentPerson => currentPerson.id === request.params.id)

    if (!personExists) {
      return response.status(404).json({ error: 'person not found' })
    }

    await writePersons(
      persons.filter(currentPerson => currentPerson.id !== request.params.id)
    )

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use('/api', (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
})

app.get('*', (request, response) => {
  response.sendFile(path.join(distPath, 'index.html'))
})

app.use((error, request, response, next) => {
  console.error(error.stack || error)
  response.status(500).json({ error: 'internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
