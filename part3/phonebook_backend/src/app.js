const express = require('express')

const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const { getFrontendOrigins } = require('./config')
const errorHandler = require('./middleware/errorHandler')
const unknownEndpoint = require('./middleware/unknownEndpoint')
const personsRouter = require('./routes/persons')
const db = require('./utils/store')

const app = express()
const allowedOrigins = getFrontendOrigins()

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
app.use(express.json())
app.use(morgan('tiny'))
// Redirect the root URL to the public information page
// app.get('/', (request, response) => {
//   response.redirect('/info')
// })

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


app.use('/api/persons', personsRouter)
// Serve the React production build
app.use(
  express.static(path.join(__dirname, '../dist'))
)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
