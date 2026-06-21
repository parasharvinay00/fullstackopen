// Import React hook used for storing changing data inside the component.
import { useState, useEffect } from 'react'

// Import the Note component used to display one note.
import Note from './components/Note'

// Import the notes service used to communicate with the backend server.
import noteService from './services/notes'

// Import the Notification component used to show error messages.
import Notification from './components/Notification'

// Import the Footer component used to show the footer section.
import Footer from './components/Footer'

// Create the main App component.
const App = () => {
  // Create state for storing all notes fetched from the server.
  const [notes, setNotes] = useState([])

  // Create state for storing the text typed inside the input field.
  const [newNote, setNewNote] = useState('')

  // Create state for controlling whether all notes or only important notes are shown.
  const [showAll, setShowAll] = useState(true)

  // Create state for storing an error message shown to the user.
  const [errorMessage, setErrorMessage] = useState(null)

  // Run this effect only once after the first render.
  useEffect(() => {
    // Show in console that data fetching has started.
    console.log('useEffect started: fetching notes from server')

    // Call the backend service to get all notes.
    noteService
      .getAll()
      // Run this code when notes are successfully received from the server.
      .then(initialNotes => {
        // Show the received notes in the console.
        console.log('Notes received from server:', initialNotes)

        // Save the received notes into React state.
        setNotes(initialNotes)
      })
      // Run this code if fetching notes fails.
      .catch(error => {
        // Show the error object in the console.
        console.log('Fetching notes failed:', error)

        // Save an error message for the user.
        setErrorMessage('Failed to fetch notes from server')

        // Remove the error message after 5 seconds.
        setTimeout(() => {
          // Clear the error message.
          setErrorMessage(null)
        }, 5000)
      })
  }, [])

  // Show how many notes are currently stored in state.
  console.log('Current number of notes:', notes.length)

  // Create a function that runs when the note form is submitted.
  const addNote = event => {
    // Stop the browser from refreshing the page after form submit.
    event.preventDefault()

    // Show the submitted input value in the console.
    console.log('Form submitted with value:', newNote)

    // Check whether the input is empty after removing extra spaces.
    if (newNote.trim() === '') {
      // Show in console that empty note was blocked.
      console.log('Empty note blocked')

      // Stop the function because empty notes should not be saved.
      return
    }

    // Create a new note object that will be sent to the backend.
    const noteObject = {
      // Store the cleaned input text as the note content.
      content: newNote.trim(),

      // Randomly decide whether the new note is important or not.
      important: Math.random() > 0.5,
    }

    // Show the note object before sending it to the server.
    console.log('New note object created:', noteObject)

    // Send the new note object to the backend server.
    noteService
      .create(noteObject)
      // Run this code when the server successfully saves the note.
      .then(createdNote => {
        // Show the saved note returned by the server.
        console.log('Note successfully created:', createdNote)

        // Add the created note to the existing notes state.
        setNotes(currentNotes => currentNotes.concat(createdNote))

        // Clear the input field after saving the note.
        setNewNote('')
      })
      // Run this code if creating the note fails.
      .catch(error => {
        // Show the creation error in the console.
        console.log('Creating note failed:', error)

        // Save an error message for the user.
        setErrorMessage('Failed to create note')

        // Remove the error message after 5 seconds.
        setTimeout(() => {
          // Clear the error message.
          setErrorMessage(null)
        }, 5000)
      })
  }

  // Create a function that runs every time the user types in the input.
  const handleNoteChange = event => {
    // Show the newest input value in the console.
    console.log('Input changed:', event.target.value)

    // Save the newest input value into React state.
    setNewNote(event.target.value)
  }

  // Create a function that toggles the importance of a note.
  const toggleImportanceOf = id => {
    // Show which note id the user is trying to update.
    console.log(`Trying to toggle importance of note with id: ${id}`)

    // Find the note from the notes array using the given id.
    const note = notes.find(n => n.id === id)

    // Show the found note in the console.
    console.log('Found note:', note)

    // Check whether the note was not found in the current state.
    if (!note) {
      // Show in console that no note was found.
      console.log(`No note found with id: ${id}`)

      // Save an error message for the user.
      setErrorMessage('Note was not found in the app state')

      // Remove the error message after 5 seconds.
      setTimeout(() => {
        // Clear the error message.
        setErrorMessage(null)
      }, 5000)

      // Stop the function because there is no note to update.
      return
    }

    // Create a copy of the note with the important value reversed.
    const changedNote = {
      // Copy all old properties of the note.
      ...note,

      // Change important from true to false or false to true.
      important: !note.important,
    }

    // Show the changed note before sending it to the server.
    console.log('Changed note before update:', changedNote)

    // Send the changed note to the backend server.
    noteService
      .update(id, changedNote)
      // Run this code when the update succeeds.
      .then(returnedNote => {
        // Show the updated note returned by the server.
        console.log('Update succeeded:', returnedNote)

        // Replace the old note with the updated note inside state.
        setNotes(currentNotes =>
          // Go through every note in the current notes array.
          currentNotes.map(currentNote =>
            // Replace only the note whose id matches the updated note id.
            currentNote.id === id ? returnedNote : currentNote
          )
        )
      })
      // Run this code if the update fails.
      .catch(error => {
        // Show the general error message.
        console.log('Update failed:', error.message)

        // Check whether the server sent an error response.
        if (error.response) {
          // Show the HTTP status code from the server.
          console.log('Status:', error.response.status)

          // Show the server response data.
          console.log('Server response:', error.response.data)
        }

        // Save a user-friendly error message.
        setErrorMessage(`Note '${note.content}' was already removed from server`)

        // Remove the error message after 5 seconds.
        setTimeout(() => {
          // Clear the error message.
          setErrorMessage(null)
        }, 5000)

        // Remove the deleted note from the frontend state.
        setNotes(currentNotes => currentNotes.filter(n => n.id !== id))
      })
  }

  // Decide which notes should be visible on the screen.
  const notesToShow = showAll
    // Show all notes when showAll is true.
    ? notes
    // Show only important notes when showAll is false.
    : notes.filter(note => note.important)

  // Show the notes that will be rendered.
  console.log('Notes currently visible:', notesToShow)

  // Return the JSX that React renders to the browser.
  return (
    // Create the main page container.
    <div>
      {/* Show the main heading of the app. */}
      <h1>Notes</h1>

      {/* Show the notification message if there is an error. */}
      <Notification message={errorMessage} />

      {/* Create a container for the filter button. */}
      <div>
        {/* Create a button for switching between all notes and important notes. */}
        <button onClick={() => {
          // Show the old showAll value before changing it.
          console.log('Toggling showAll from:', showAll)

          // Reverse the showAll value.
          setShowAll(!showAll)
        }}>
          {/* Change the button text depending on the current showAll value. */}
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      {/* Create a list container for notes. */}
      <ul>
        {/* Go through visible notes and render one Note component for each note. */}
        {notesToShow.map(note =>
          // Render one Note component.
          <Note
            // Give React a unique key for this note.
            key={note.id}

            // Pass the note object to the Note component.
            note={note}

            // Pass a function that toggles this note's importance.
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      {/* Create a form for adding a new note. */}
      <form onSubmit={addNote}>
        {/* Create a controlled input field for typing a new note. */}
        <input
          // Connect the input value to React state.
          value={newNote}

          // Update React state whenever the user types.
          onChange={handleNoteChange}
        />

        {/* Create a submit button for saving the note. */}
        <button type="submit">save</button>
      </form>

      {/* Show the footer component. */}
      <Footer />
    </div>
  )
}

// Export the App component so it can be imported in main.jsx.
export default App