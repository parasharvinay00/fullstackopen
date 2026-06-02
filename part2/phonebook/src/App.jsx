import { useState, useEffect } from 'react'

// localStorage key used to save and read phonebook data
const STORAGE_KEY = 'phonebookPersons'

// This component renders the search/filter input
const Filter = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      filter shown with:{' '}
      <input
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  )
}

// This component renders the form for adding a new person
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

// This component renders one person's name and number
const Person = ({ person }) => {
  return (
    <div>
      {person.name} {person.number}
    </div>
  )
}

// This component renders all visible persons
const Persons = ({ personsToShow }) => {
  return (
    <div>
      {personsToShow.map(person =>
        <Person
          key={person.id}
          person={person}
        />
      )}
    </div>
  )
}

const App = () => {
  // CONTROL FLOW STEP 1:
  // When the app starts, React initializes the persons state.
  // First we check localStorage.
  // If saved contacts exist, we use them.
  // If not, we use the default hardcoded contacts.
  const [persons, setPersons] = useState(() => {
    console.log('STEP 1: App is starting')
    console.log('STEP 2: Checking localStorage for saved persons')

    const savedPersons = localStorage.getItem(STORAGE_KEY)

    if (savedPersons) {
      console.log('STEP 3: Saved persons found in localStorage')
      console.log('Saved persons as JSON string:', savedPersons)

      const parsedPersons = JSON.parse(savedPersons)

      console.log('STEP 4: Converted saved JSON string back to JavaScript array')
      console.log('Parsed persons:', parsedPersons)

      return parsedPersons
    }

    console.log('STEP 3: No saved persons found in localStorage')
    console.log('STEP 4: Using default persons')

    return [
      { name: 'Arto Hellas', number: '040-123456', id: 1 },
      { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
      { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
      { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ]
  })

  // CONTROL FLOW STEP 5:
  // These states control the input fields.
  // newName stores the name input value.
  // newNumber stores the number input value.
  // searchTerm stores the filter/search input value.
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // CONTROL FLOW STEP 6:
  // Whenever persons changes, save the latest persons array to localStorage.
  // This is what prevents contacts from vanishing after refresh.
  useEffect(() => {
    console.log('STEP 6: persons state changed')
    console.log('Updated persons:', persons)

    const personsAsJSON = JSON.stringify(persons)

    console.log('STEP 7: Converting persons array to JSON string')
    console.log('Persons as JSON:', personsAsJSON)

    localStorage.setItem(STORAGE_KEY, personsAsJSON)

    console.log('STEP 8: Saved latest persons to localStorage')
  }, [persons])

  // CONTROL FLOW STEP 9:
  // This function runs every time user types in the name input.
  const handleNameChange = (event) => {
    console.log('STEP 9: User typed in name input')
    console.log('Current name input value:', event.target.value)

    setNewName(event.target.value)
  }

  // CONTROL FLOW STEP 10:
  // This function runs every time user types in the number input.
  const handleNumberChange = (event) => {
    console.log('STEP 10: User typed in number input')
    console.log('Current number input value:', event.target.value)

    setNewNumber(event.target.value)
  }

  // CONTROL FLOW STEP 11:
  // This function runs every time user types in the search/filter input.
  const handleSearchChange = (event) => {
    console.log('STEP 11: User typed in search input')
    console.log('Current search input value:', event.target.value)

    setSearchTerm(event.target.value)
  }

  // CONTROL FLOW STEP 12:
  // This function runs when user submits the add person form.
  const addPerson = (event) => {
    console.log('STEP 12: Form submitted')

    // Prevents the browser from refreshing the page
    event.preventDefault()

    console.log('STEP 13: Page refresh prevented using event.preventDefault()')

    // Remove extra spaces from name and number
    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    console.log('STEP 14: Trimmed input values')
    console.log('trimmedName:', trimmedName)
    console.log('trimmedNumber:', trimmedNumber)

    // Stop if name or number is empty
    if (trimmedName === '' || trimmedNumber === '') {
      console.log('STEP 15: Name or number is empty, so person is not added')
      return
    }

    // Check if the name already exists in the phonebook
    const nameAlreadyExists = persons.some(person =>
      person.name.toLowerCase() === trimmedName.toLowerCase()
    )

    console.log('STEP 16: Checking duplicate name')
    console.log('Does name already exist?', nameAlreadyExists)

    // If duplicate exists, show alert and stop function
    if (nameAlreadyExists) {
      console.log('STEP 17: Duplicate name found, showing alert')

      alert(`${trimmedName} is already added to phonebook`)

      console.log('STEP 18: Stopping addPerson function because duplicate exists')
      return
    }

    // Create a new person object
    const personObject = {
      name: trimmedName,
      number: trimmedNumber,
      id: Date.now()
    }

    console.log('STEP 19: Created new person object')
    console.log('New person:', personObject)

    // Add the new person to persons state
    // concat creates a new array instead of mutating the old array
    setPersons(persons.concat(personObject))

    console.log('STEP 20: setPersons called with updated persons array')

    // Clear both input fields after adding the person
    setNewName('')
    setNewNumber('')

    console.log('STEP 21: Input fields cleared')
  }

  // CONTROL FLOW STEP 22:
  // This creates the filtered list of persons.
  // If searchTerm is empty, every person is shown.
  // If searchTerm has text, only matching names are shown.
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  console.log('STEP 22: App rendered')
  console.log('Current persons state:', persons)
  console.log('Current newName state:', newName)
  console.log('Current newNumber state:', newNumber)
  console.log('Current searchTerm state:', searchTerm)
  console.log('Persons currently visible:', personsToShow)

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

      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App