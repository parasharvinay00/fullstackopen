import { useState, useEffect } from 'react'
// import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'

const App = () => {
  // Stores all notes fetched from the server
  const [notes, setNotes] = useState([])

  // Stores the current input value
  const [newNote, setNewNote] = useState('')

  // Controls whether all notes or only important notes are shown
  const [showAll, setShowAll] = useState(true)

  // Runs once after the first render
  // Fetches initial notes from JSON Server
  useEffect(() => {
    console.log('effect: fetching notes from server')

    noteService
      .getAll()
      .then(notes => {
        console.log('notes?',notes)
        setNotes(notes)
      })
    // axios
    //   .get('http://localhost:3001/notes')
    //   .then(response => {
    //     console.log('promise fulfilled')
    //     console.log('notes from server:', response.data)

    //     setNotes(response.data)
    //   })
  }, [])

  // console.log('render', notes.length, 'notes?')
  console.log(notes?.length)

  // Runs when the form is submitted
  const addNote = event => {
    event.preventDefault()

    if (newNote.trim() === '') {
      return
    }

    const noteObject = {
      content: newNote.trim(),
      important: Math.random() > 0.5,
    }
     noteService
      .create(noteObject)
      .then(note => {
        console.log('note?',note)
        setNotes(notes.concat(note))
        setNewNote('')
      }) 
    // axios
    //   .post('http://localhost:3001/notes', noteObject)
    //   .then(response => {
    //     console.log('new note saved:', response.data)

    //     setNotes(notes.concat(response.data))
    //     setNewNote('')
    //   })
  }

  // Runs every time user types in the input
  const handleNoteChange = event => {
    setNewNote(event.target.value)
  }

 const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  noteService
    .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id === id ? returnedNote : note))
    })

    .catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })
}

  // Decides which notes should be visible
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {notesToShow?.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App