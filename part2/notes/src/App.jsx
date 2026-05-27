import Note from './components/Note'

const App = (props) => {
  console.log('1. App received props:', props)

  const { notes } = props

  console.log('2. Notes extracted in App:', notes)

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => {
          console.log('3. App is creating a Note for:', note)

          return (
            <Note key={note.id} note={note} />
          )
        })}
      </ul>
    </div>
  )
}

export default App