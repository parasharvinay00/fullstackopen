import { useCallback, useEffect, useRef, useState } from 'react'
import AuthForm from './components/AuthForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import authService from './services/auth'
import personService from './services/persons'
import { clearToken, setUnauthorizedHandler } from './services/apiClient'
import {
  normalizeIndianPhoneNumber,
  validateLogin,
  validateRegistration
} from './utils/authValidation'

const storageKey = 'phonebookAuth'

const emptyLoginForm = {
  identifier: '',
  password: ''
}

const emptyRegistrationForm = {
  confirmPassword: '',
  password: '',
  phoneNumber: '',
  username: ''
}

const App = () => {
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [loginForm, setLoginForm] = useState(emptyLoginForm)
  const [registrationForm, setRegistrationForm] = useState(emptyRegistrationForm)
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const notificationTimeoutRef = useRef(null)

  const [notification, setNotification] = useState({
    message: null,
    type: 'success'
  })

  const showNotification = useCallback((message, type = 'success') => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }

    setNotification({
      message,
      type
    })

    notificationTimeoutRef.current = setTimeout(() => {
      setNotification({
        message: null,
        type: 'success'
      })
    }, 5000)
  }, [])

  const clearAuthentication = useCallback((message = 'Session expired. Please log in again.') => {
    localStorage.removeItem(storageKey)
    clearToken()
    setUser(null)
    setPersons([])
    setFilterText('')
    setNewName('')
    setNewNumber('')
    showNotification(message, 'error')
  }, [showNotification])

  useEffect(() => {
    setUnauthorizedHandler(() => clearAuthentication())

    return () => {
      setUnauthorizedHandler(null)
    }
  }, [clearAuthentication])

  useEffect(() => {
    const savedSession = localStorage.getItem(storageKey)

    if (!savedSession) {
      return
    }

    try {
      const parsedSession = JSON.parse(savedSession)

      if (parsedSession.token && parsedSession.user) {
        personService.setToken(parsedSession.token)
        setUser(parsedSession.user)
      }
    } catch {
      localStorage.removeItem(storageKey)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      return
    }

    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        if (error.response?.status === 401) {
          return
        }

        showNotification(
          'Could not load the phonebook',
          'error'
        )
      })
  }, [user, showNotification])

  useEffect(() => () => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }
  }, [])

  const getErrorMessage = (error, fallbackMessage) =>
    error.response?.data?.error || fallbackMessage

  const persistSession = session => {
    localStorage.setItem(storageKey, JSON.stringify(session))
    personService.setToken(session.token)
    setUser(session.user)
  }

  const handleAuthModeChange = mode => {
    setAuthMode(mode)
  }

  const handleLoginFieldChange = event => {
    const { name, value } = event.target

    setLoginForm(currentForm => ({
      ...currentForm,
      [name]: value
    }))
  }

  const handleRegistrationFieldChange = event => {
    const { name, value } = event.target

    setRegistrationForm(currentForm => ({
      ...currentForm,
      [name]: value
    }))
  }

  const registerUser = event => {
    event.preventDefault()

    const validationMessage = validateRegistration(registrationForm)

    if (validationMessage) {
      showNotification(validationMessage, 'error')
      return
    }

    authService
      .register({
        username: registrationForm.username.trim(),
        phoneNumber: normalizeIndianPhoneNumber(registrationForm.phoneNumber),
        password: registrationForm.password
      })
      .then(createdUser => {
        setRegistrationForm(emptyRegistrationForm)
        setAuthMode('login')
        setLoginForm({
          identifier: createdUser.username,
          password: ''
        })
        showNotification('Registration successful. You can log in now.')
      })
      .catch(error => {
        showNotification(
          getErrorMessage(error, 'Could not register user'),
          'error'
        )
      })
  }

  const loginUser = event => {
    event.preventDefault()

    const validationMessage = validateLogin(loginForm)

    if (validationMessage) {
      showNotification(validationMessage, 'error')
      return
    }

    authService
      .login({
        identifier: loginForm.identifier.trim(),
        password: loginForm.password
      })
      .then(session => {
        persistSession(session)
        setLoginForm(emptyLoginForm)
        showNotification(`Welcome back, ${session.user.username}`)
      })
      .catch(error => {
        showNotification(
          getErrorMessage(error, 'Invalid credentials'),
          'error'
        )
      })
  }

  const logout = () => {
    localStorage.removeItem(storageKey)
    clearToken()
    setUser(null)
    setPersons([])
    setFilterText('')
    setNewName('')
    setNewNumber('')
    showNotification('Logged out successfully')
  }

  const deletePerson = personToDelete => {
    const confirmDeletion = window.confirm(
      `Delete ${personToDelete.name}?`
    )

    if (!confirmDeletion) {
      return
    }

    personService
      .remove(personToDelete.id)
      .then(() => {
        setPersons(currentPersons =>
          currentPersons.filter(
            person => person.id !== personToDelete.id
          )
        )

        showNotification(
          `Deleted ${personToDelete.name}`
        )
      })
      .catch(error => {
        if (error.response?.status === 401) {
          return
        }

        showNotification(
          getErrorMessage(
            error,
            `Information of ${personToDelete.name} has already been removed from the server`
          ),
          'error'
        )

        setPersons(currentPersons =>
          currentPersons.filter(
            person => person.id !== personToDelete.id
          )
        )
      })
  }

  const addPerson = event => {
    event.preventDefault()

    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    if (!trimmedName || !trimmedNumber) {
      showNotification(
        'Name and number are required',
        'error'
      )

      return
    }

    const existingPerson = persons.find(
      person =>
        person.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${existingPerson.name} is already added to the phonebook. Replace the old number with a new one?`
      )

      if (!confirmUpdate) {
        return
      }

      const changedPerson = {
        ...existingPerson,
        number: trimmedNumber
      }

      personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(currentPersons =>
            currentPersons.map(person =>
              person.id !== existingPerson.id
                ? person
                : returnedPerson
            )
          )

          showNotification(
            `Updated ${returnedPerson.name}`
          )

          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          if (error.response?.status === 401) {
            return
          }

          showNotification(
            getErrorMessage(
              error,
              `Information of ${existingPerson.name} has already been removed from the server`
            ),
            'error'
          )

          setPersons(currentPersons =>
            currentPersons.filter(
              person => person.id !== existingPerson.id
            )
          )

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
        setPersons(currentPersons =>
          currentPersons.concat(returnedPerson)
        )

        showNotification(
          `Added ${returnedPerson.name}`
        )

        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        if (error.response?.status === 401) {
          return
        }

        showNotification(
          getErrorMessage(error, `Could not add ${trimmedName}`),
          'error'
        )
      })
  }

  const personsToShow = persons.filter(person =>
    person.name
      .toLowerCase()
      .includes(filterText.toLowerCase())
  )

  if (!user) {
    return (
      <main className="app-shell">
        <Notification
          message={notification.message}
          type={notification.type}
        />

        <AuthForm
          mode={authMode}
          onModeChange={handleAuthModeChange}
          onSubmit={authMode === 'login' ? loginUser : registerUser}
          values={authMode === 'login' ? loginForm : registrationForm}
          onChange={authMode === 'login' ? handleLoginFieldChange : handleRegistrationFieldChange}
        />
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="phonebook-card">
        <div className="phonebook-header">
          <div>
            <h2>Phonebook</h2>
            <p className="signed-in-user">
              Signed in as {user.username} ({user.phoneNumber})
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        <Notification
          message={notification.message}
          type={notification.type}
        />

        <Filter
          filterText={filterText}
          handleFilterChange={event =>
            setFilterText(event.target.value)
          }
        />

        <h3>Add a new</h3>

        <PersonForm
          addPerson={addPerson}
          newName={newName}
          newNumber={newNumber}
          handleNameChange={event =>
            setNewName(event.target.value)
          }
          handleNumberChange={event =>
            setNewNumber(event.target.value)
          }
        />

        <h3>Numbers</h3>

        <Persons
          persons={personsToShow}
          deletePerson={deletePerson}
        />
      </section>
    </main>
  )
}

export default App
