// Load Mongoose.
const mongoose = require('mongoose')

// Configure how Mongoose handles query filters.
mongoose.set('strictQuery', false)

// Read the database connection string from the environment.
const url = process.env.MONGODB_URI

// Stop with a clear error if MONGODB_URI is missing.
if (!url) {
    console.error('MONGODB_URI is missing from the .env file')
    process.exit(1)
}

// Avoid printing the complete URL because it contains the password.
console.log('connecting to MongoDB')

// Connect to MongoDB Atlas.
mongoose
    .connect(url, { family: 4 })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.error('error connecting to MongoDB:', error.message)
    })

// Define the structure of a note.
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

// Control how note documents are converted into JSON.
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        // Create a frontend-friendly string id.
        returnedObject.id = returnedObject._id.toString()

        // Remove MongoDB and Mongoose internal properties.
        delete returnedObject._id
        delete returnedObject.__v
    },
})

// Create and export the Note model.
module.exports = mongoose.model('Note', noteSchema)