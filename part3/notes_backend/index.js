const express = require('express')
const mongoose = require('mongoose')

const app = express()

// Allows Express to read JSON data from request bodies.
app.use(express.json())

// Read the MongoDB password from the command line.
const rawPassword = process.argv[2]

// Stop the program when no password is supplied.
if (!rawPassword) {
    console.log('Give the MongoDB password as a command-line argument.')
    console.log("Example: node --watch index.js 'yourPassword'")
    process.exit(1)
}

// Encode special characters in the password before inserting it into the URL.
const password = encodeURIComponent(rawPassword)

// Replace YOUR_CLUSTER_ADDRESS with the address copied from MongoDB Atlas.
const url =
    `mongodb+srv://fullstack01:${password}` +
    `@clusterm8.szjjuwm.mongodb.net/noteApp` +
    `?retryWrites=true&w=majority&appName=Clusterm8`

mongoose.set('strictQuery', false)

// Define the structure of a note stored in MongoDB.
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

// Change the format of notes before sending them as JSON.
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        // Convert MongoDB's ObjectId into a normal string called id.
        returnedObject.id = returnedObject._id.toString()

        // Remove MongoDB and Mongoose internal fields.
        delete returnedObject._id
        delete returnedObject.__v
    },
})

// Create the Note model.
const Note = mongoose.model('Note', noteSchema)

// Test route.
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// Retrieve every note from MongoDB.
app.get('/api/notes', (request, response) => {
    Note.find({})
        .then(notes => {
            response.json(notes)
        })
        .catch(error => {
            console.error('Error retrieving notes:', error.message)

            response.status(500).json({
                error: 'Could not retrieve notes from the database',
            })
        })
})

const PORT = 3001

// Connect to MongoDB before starting the Express server.
mongoose
    .connect(url, { family: 4 })
    .then(() => {
        console.log('Connected to MongoDB')

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error.message)
        process.exit(1)
    })