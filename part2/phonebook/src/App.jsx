import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ searchTerm, handleSearchChange }) => {
  // This component shows the search box.
  // The input value comes from searchTerm, so React controls what is shown inside the input.
  // When the user types, handleSearchChange runs and updates the searchTerm state in App.
  console.log('Filter: rendering search input with current search term', searchTerm)

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
  // This component shows the form used to add a new person.
  // newName controls the name input value, and newNumber controls the number input value.
  // When the user types in either input, the matching handler updates state in App.
  // When the form is submitted, addPerson runs instead of the browser doing a normal page reload.
  console.log('PersonForm: rendering form with current input values', {
    newName,
    newNumber
  })

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
  // This component shows one person's name and phone number.
  // The delete button runs removePerson when clicked so this exact person can be removed.
  console.log('Person: rendering a single phonebook entry', person)

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
  // This component shows the list of persons that passed the current search filter.
  // map goes through every person inside personsToShow and creates one Person component for each item.
  // key helps React track each rendered person row.
  // removePerson is wrapped inside an arrow function so the person's id and name are passed only when the button is clicked.
  console.log('Persons: rendering filtered phonebook entries', personsToShow)

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
  // persons stores all phonebook entries currently loaded into the app.
  // newName stores the current text inside the name input.
  // newNumber stores the current text inside the number input.
  // searchTerm stores the current text inside the search input.
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // useEffect with an empty dependency array runs only once after the first render.
    // This is used to load the initial phonebook data from the server when the app starts.
    console.log('App: requesting initial phonebook data from the server')
    personService
      .getAll()
      .then(initialPersons => {
        // When the server response arrives, initialPersons contains the full list from the backend.
        // setPersons saves that list into state, which causes the app to render the loaded persons.
        console.log('App: initial phonebook data loaded', initialPersons)
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = event => {
    // event.target.value is the latest text typed into the name input.
    // setNewName stores that text in state so the input stays controlled by React.
    console.log('App: updating name input state', event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    // event.target.value is the latest text typed into the number input.
    // setNewNumber stores that text in state so the input stays controlled by React.
    console.log('App: updating number input state', event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = event => {
    // event.target.value is the latest text typed into the search input.
    // setSearchTerm stores that text in state.
    // After state changes, the app renders again and the filtered list is recalculated.
    console.log('App: updating search term', event.target.value)
    setSearchTerm(event.target.value)
  }

  const addPerson = event => {
    // preventDefault stops the browser from sending the form normally and reloading the page.
    // This function then handles the full add-or-update flow inside React.
    event.preventDefault()
    console.log('App: add person flow started', {
      newName,
      newNumber
    })

    // trim removes spaces from the beginning and end of the input values.
    // This helps avoid saving names or numbers that look filled but are only spaces.
    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    if (trimmedName === '' || trimmedNumber === '') {
      // If either cleaned value is empty, the function stops here and nothing is sent to the server.
      console.log('App: submission stopped because name or number is empty after trimming')
      return
    }

    // find checks whether a person with the same name already exists.
    // toLowerCase is used on both names so the comparison ignores uppercase and lowercase differences.
    const existingPerson = persons.find(person =>
      person.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (existingPerson) {
      // If a matching person is found, the app asks whether the old number should be replaced.
      console.log('App: existing person found, asking for confirmation to replace number', existingPerson)
      const confirmed = window.confirm(
        `${trimmedName} is already added to phonebook, replace the old number with a new one?`
      )

      if (!confirmed) {
        // If the user cancels the confirmation dialog, the function stops and the old data stays unchanged.
        console.log('App: number replacement cancelled by the user')
        return
      }

      // changedPerson copies every field from the existing person
      // and then replaces only the number with the new trimmed number.
      const changedPerson = {
        ...existingPerson,
        number: trimmedNumber
      }

      // update sends the edited person to the backend using the existing person's id.
      console.log('App: sending updated person to the server', changedPerson)
      personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          // returnedPerson is the updated person object received from the server.
          // map creates a new persons array.
          // For the person with the matching id, the old object is replaced with returnedPerson.
          // All other persons stay unchanged.
          console.log('App: server returned updated person', returnedPerson)
          setPersons(persons.map(person =>
            person.id === existingPerson.id ? returnedPerson : person
          ))

          // After a successful update, both form inputs are cleared.
          console.log('App: cleared form after successful update')
          setNewName('')
          setNewNumber('')
        })

      // return stops the function so it does not continue into the "create new person" logic below.
      return
    }

    // If no existing person was found, create a new object to send to the backend.
    const personObject = {
      name: trimmedName,
      number: trimmedNumber
    }

    // create sends the new person data to the server.
    console.log('App: sending new person to the server', personObject)
    personService
      .create(personObject)
      .then(returnedPerson => {
        // returnedPerson is the saved person object from the server, usually including its id.
        // concat creates a new array with the old persons plus the new saved person.
        console.log('App: server returned created person', returnedPerson)
        setPersons(persons.concat(returnedPerson))
        // After a successful create, both form inputs are cleared.
        console.log('App: cleared form after successful creation')
        setNewName('')
        setNewNumber('')
      })
  }

  const removePerson = (id, name) => {
    // This function starts when the delete button for one person is clicked.
    // It receives that person's id and name so the correct record can be removed.
    console.log('App: delete flow started for person', { id, name })
    const confirmed = window.confirm(`Delete ${name}?`)

    if (!confirmed) {
      // If the user cancels the confirmation dialog, the function stops and no delete request is sent.
      console.log('App: deletion cancelled by the user')
      return
    }

    // remove sends a delete request to the backend using the selected person's id.
    console.log('App: sending delete request for person', { id, name })
    personService
      .remove(id)
      .then(() => {
        // filter creates a new array that keeps every person except the one whose id was deleted.
        // setPersons saves that new array into state so the removed person disappears from the UI.
        console.log('App: delete request completed, removing person from local state', { id, name })
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  // filter checks every person in the full persons array.
  // includes keeps a person in the result when the person's name contains the search text.
  // toLowerCase on both values makes the search ignore uppercase and lowercase differences.
  // personsToShow is the final filtered array used for rendering the visible list.
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  console.log('App: computed filtered persons for rendering', {
    searchTerm,
    personsToShow
  })

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
