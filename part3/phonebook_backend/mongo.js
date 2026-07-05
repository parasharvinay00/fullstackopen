const mongoose = require('mongoose')

// The correct commands contain either:
//
// node mongo.js password
//
// or:
//
// node mongo.js password name number
if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('Usage:')
    console.log('  node mongo.js <password>')
    console.log('  node mongo.js <password> <name> <number>')
    process.exit(1)
}

// Get the password from the command line.
const password = process.argv[2]

// Encode special characters such as @, # and / in the password.
const encodedPassword = encodeURIComponent(password)

// Replace these values using your MongoDB Atlas connection string.

const url =
    `mongodb+srv://Tiro:${encodedPassword}` +
    `@clusterm9.lbrwq3c.mongodb.net/phonebookApp` +
    `?retryWrites=true&w=majority&appName=ClusterM9`

mongoose.set('strictQuery', false)

// Connect the program to MongoDB Atlas.
mongoose.connect(url)

// Define what a person document looks like.
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// Mongoose will use a collection named "people".
const Person = mongoose.model('Person', personSchema)

// Only the password was provided.
if (process.argv.length === 3) {
    Person.find({})
        .then(persons => {
            console.log('phonebook:')

            persons.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })

            // Close only after MongoDB has returned the persons.
            return mongoose.connection.close()
        })
        .catch(error => {
            console.error('Failed to retrieve phonebook entries:')
            console.error(error.message)

            return mongoose.connection.close()
        })
}

// Password, name and number were provided.
if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name,
        number,
    })

    person
        .save()
        .then(() => {
            console.log(`added ${name} number ${number} to phonebook`)

            // Close only after the person has been saved.
            return mongoose.connection.close()
        })
        .catch(error => {
            console.error('Failed to add person:')
            console.error(error.message)

            return mongoose.connection.close()
        })
}