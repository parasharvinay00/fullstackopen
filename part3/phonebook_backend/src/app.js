const express = require('express')

const cors = require('cors')
const morgan = require('morgan')

const { FRONTEND_ORIGIN } = require('./config')
const auth = require('./middleware/auth')
const errorHandler = require('./middleware/errorHandler')
const unknownEndpoint = require('./middleware/unknownEndpoint')
const loginRouter = require('./routes/login')
const personsRouter = require('./routes/persons')
const usersRouter = require('./routes/users')
const { createSafeBodySnapshot } = require('./utils/logging')
const db = require('./utils/store')

const app = express()

morgan.token('safe-body', request => JSON.stringify(createSafeBodySnapshot(request.body)))

app.use(cors({
  origin: FRONTEND_ORIGIN
}))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :safe-body')
)

app.get('/info', async (request, response, next) => {
  try {
    const state = await db.read()
    const currentTime = new Date()

    response.send(`
      <p>Phonebook has info for ${state.persons.length} contacts</p>
      <p>${currentTime}</p>
    `)
  } catch (error) {
    next(error)
  }
})

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/perons', auth.requireAuth, personsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
