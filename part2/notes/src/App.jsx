import { useState, useEffect } from 'react'
import Note from './components/Note'

const App = (props) => {
  // First check if notes already exist in localStorage
  const savedNotes = localStorage.getItem('notes')

  // If saved notes exist, use them.
  // Otherwise, use the original notes from props.
  const initialNotes = savedNotes
    ? JSON.parse(savedNotes)
    : props.notes

  // Store all notes in React state
  const [notes, setNotes] = useState(initialNotes)

  // Store the current input value
  const [newNote, setNewNote] = useState('')

  // Store whether we show all notes or only important notes
  const [showAll, setShowAll] = useState(true)

  // Save notes to localStorage every time notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const addNote = (event) => {
    event.preventDefault()

    if (newNote.trim() === '') {
      return
    }

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1),
    }

    setNotes(notes.concat(noteObject))
    setNewNote('')
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

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
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
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