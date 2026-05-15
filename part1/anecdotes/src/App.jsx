import { useState } from 'react'

const App = () => {
  // Stores all anecdote texts that the application can display to the user.
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

  // Keeps track of which anecdote is currently selected and shown on the screen.
  const [selected, setSelected] = useState(0)
  console.log('Selected anecdote index:', selected)
  console.log('Selected anecdote text:', anecdotes[selected])

  // Stores the vote count for each anecdote by matching vote positions to anecdote positions.
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  console.log('Current votes array:', votes)
  console.log('Votes for selected anecdote:', votes[selected])

  // Increases the vote count for the currently displayed anecdote and saves the updated vote list.
  const handleVote = () => {
    console.log('Vote button clicked for anecdote index:', selected)
    const copy = [...votes]
    copy[selected] += 1
    console.log('Updated votes array after voting:', copy)
    setVotes(copy)
  }

  // Selects a random anecdote index so the UI can display a different anecdote.
  const handleNextAnecdote = () => {
    console.log('Next anecdote button clicked')
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    console.log('Random anecdote index generated:', randomIndex)
    setSelected(randomIndex)
  }

  // Renders the selected anecdote, its vote count, and the action buttons for voting and navigation.
  return (
    <div>
      <div>
        {anecdotes[selected]}
      </div>

      <div>
        has {votes[selected]} votes
      </div>

      <button onClick={handleVote}>
        vote
      </button>

      <button onClick={handleNextAnecdote}>
        next anecdote
      </button>
    </div>
  )
}

export default App
