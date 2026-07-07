require('dotenv').config()

const express = require('express')
const Note = require('./models/note')

const app = express()

app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({})
        .then(notes => {
            response.json(notes)
        })
        .catch(error => {
            console.error('error retrieving notes:', error.message)

            response.status(500).json({
                error: 'could not retrieve notes',
            })
        })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing',
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important ?? false,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})