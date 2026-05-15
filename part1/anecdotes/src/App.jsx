import { useState } from 'react'

const App = () => {
  // Stores the list of anecdote texts that can be shown in the UI.
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  // Tracks which anecdote is currently selected for display.
  const [selected, setSelected] = useState(0)
  console.log('App rendered with selected anecdote index:', selected)
  console.log('Currently displayed anecdote:', anecdotes[selected])

  // Chooses a random anecdote index and updates the state to show a new anecdote.
  const handleNextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    console.log('Next anecdote button clicked')
    console.log('Generated random anecdote index:', randomIndex)
    setSelected(randomIndex)
  }

  // Renders the selected anecdote and the button for loading another one.
  return (
    <div>
      <div>
        {anecdotes[selected]}
      </div>

      <button onClick={handleNextAnecdote}>
        next anecdote
      </button>
    </div>
  )
}

export default App
