require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Phonebook backend</h1>')
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const date = new Date()

    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    `)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})