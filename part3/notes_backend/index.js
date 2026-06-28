const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
let notes = [
    {
        id: '1',
        content: 'HTML is easy',
        important: true
    },
    {
        id: '2',
        content: 'Browser can execute only JavaScript',
        important: false
    }
]

// Allows Express to read JSON request bodies
app.use(express.json())

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

app.put('/api/notes/:id', (request, response) => {
    const body = request.body
    const { id } = request.params
    const noteToUpdate = notes.find(note => note.id === id)

    if (!noteToUpdate) {
        return response.status(404).json({
            error: 'note not found'
        })
    }

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const updatedNote = {
        ...noteToUpdate,
        content: body.content,
        important: body.important ?? noteToUpdate.important,
    }

    notes = notes.map(note => note.id === id ? updatedNote : note)

    response.json(updatedNote)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
