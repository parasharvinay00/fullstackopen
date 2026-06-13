import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      S e a r c h :{' '}
      <input
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  )
}

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>

      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person, removePerson }) => {
  return (
    <div>
      {person.name} {person.number}{' '}
      <button onClick={removePerson}>
        delete
      </button>
    </div>
  )
}

const Persons = ({ personsToShow, removePerson }) => {
  return (
    <div>
      {personsToShow.map(person =>
        <Person
          key={person.id}
          person={person}
          removePerson={() => removePerson(person.id, person.name)}
        />
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = event => {
    setSearchTerm(event.target.value)
  }

  const addPerson = event => {
    event.preventDefault()

    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    if (trimmedName === '' || trimmedNumber === '') {
      return
    }

    const existingPerson = persons.find(person =>
      person.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (existingPerson) {
      const confirmed = window.confirm(
        `${trimmedName} is already added to phonebook, replace the old number with a new one?`
      )

      if (!confirmed) {
        return
      }

      const changedPerson = {
        ...existingPerson,
        number: trimmedNumber
      }

      personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person =>
            person.id === existingPerson.id ? returnedPerson : person
          ))

          setNewName('')
          setNewNumber('')
        })

      return
    }

    const personObject = {
      name: trimmedName,
      number: trimmedNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const removePerson = (id, name) => {
    const confirmed = window.confirm(`Delete ${name}?`)

    if (!confirmed) {
      return
    }

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons
        personsToShow={personsToShow}
        removePerson={removePerson}
      />
    </div>
  )
}

export default App