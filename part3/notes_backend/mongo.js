const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://fullstack01:${password}@clusterm8.szjjuwm.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })

    mongoose.connection.close()
})