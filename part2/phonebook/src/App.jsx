import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showNotification = (message) => {
    setNotificationMessage(message)

    setTimeout(() => {
      setNotificationMessage(null) 
    }, 5000) // Default value 5000 = 5 seconds
  }

  const addPerson = (event) => {
    event.preventDefault()

    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    const existingPerson = persons.find(
      person => person.name.trim().toLowerCase() === trimmedName.toLowerCase()
    )

    const personObject = {
      name: trimmedName,
      number: trimmedNumber
    }

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const changedPerson = {
          ...existingPerson,
          number: trimmedNumber
        }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(person =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            )

            showNotification(`Updated ${returnedPerson.name}`)

            setNewName('')
            setNewNumber('')
          })
      }

      return
    }

    console.log('Submitting person:', personObject)

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))

        showNotification(`Added ${returnedPerson.name}`)

        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error('Create person failed:', {
          status: error.response?.status,
          data: error.response?.data
        })

        const backendMessage =
          error.response?.data?.error ||
          'Could not add the person'

        showNotification(backendMessage)
      })
  }

  const deletePerson = (personToDelete) => {
    const confirmDelete = window.confirm(
      `Delete ${personToDelete.name}?`
    )

    if (!confirmDelete) {
      return
    }

    personService
      .remove(personToDelete.id)
      .then(() => {
        setPersons(
          persons.filter(person => person.id !== personToDelete.id)
        )

        showNotification(`Deleted ${personToDelete.name}`)
      })
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} />

      <Filter
        filterText={filterText}
        handleFilterChange={(event) => setFilterText(event.target.value)}
      />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(event) => setNewName(event.target.value)}
        handleNumberChange={(event) => setNewNumber(event.target.value)}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App
