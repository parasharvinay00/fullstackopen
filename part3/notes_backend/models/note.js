const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

if (!url) {
    console.error('MONGODB_URI environment variable is missing')
    process.exit(1)
}

console.log('connecting to MongoDB')

mongoose
    .connect(url, { family: 4 })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.error('error connecting to MongoDB:', error.message)
        process.exit(1)
    })

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

module.exports = mongoose.model('Note', noteSchema)