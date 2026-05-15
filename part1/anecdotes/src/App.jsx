// Import useState from React so this component can remember changing values
import { useState } from 'react'

// Define the main App component
const App = () => {
  // This log runs every time the App component renders or re-renders
  console.log('App component rendered')

  // Create an array that stores all software engineering anecdotes
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

  // Log the full anecdotes array so we can see all available anecdotes in the console
  console.log('Anecdotes array:', anecdotes)

  // Log the total number of anecdotes
  console.log('Total number of anecdotes:', anecdotes.length)

  // Create state for the currently selected anecdote index
  // selected stores which anecdote is currently shown on the screen
  // setSelected updates the selected anecdote index
  const [selected, setSelected] = useState(0)

  // Log the currently selected anecdote index
  console.log('Current selected anecdote index:', selected)

  // Log the currently selected anecdote text
  console.log('Currently displayed anecdote:', anecdotes[selected])

  // Create state for votes
  // Array(anecdotes.length).fill(0) creates one vote count for each anecdote
  // Example: if there are 8 anecdotes, it creates [0, 0, 0, 0, 0, 0, 0, 0]
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  // Log the full votes array
  console.log('Current votes array:', votes)

  // Log the vote count of the currently selected anecdote
  console.log('Votes for current anecdote:', votes[selected])

  // This function runs when the user clicks the vote button
  const handleVote = () => {
    // Log that the vote button was clicked
    console.log('Vote button clicked')

    // Log which anecdote is being voted for
    console.log('Voting for anecdote index:', selected)

    // Log the votes array before updating
    console.log('Votes before update:', votes)

    // Create a copy of the votes array
    // This is important because React state should not be mutated directly
    const copy = [...votes]

    // Log the copied votes array
    console.log('Copied votes array:', copy)

    // Increase the vote count of the currently selected anecdote by 1
    copy[selected] += 1

    // Log the copied votes array after increasing the selected anecdote vote
    console.log('Copied votes array after vote update:', copy)

    // Update the votes state with the new copied array
    setVotes(copy)

    // Log that we requested React to update the votes state
    console.log('setVotes called with:', copy)
  }

  // This function runs when the user clicks the next anecdote button
  const handleNextAnecdote = () => {
    // Log that the next anecdote button was clicked
    console.log('Next anecdote button clicked')

    // Generate a random index between 0 and anecdotes.length - 1
    const randomIndex = Math.floor(Math.random() * anecdotes.length)

    // Log the generated random index
    console.log('Generated random anecdote index:', randomIndex)

    // Log the anecdote that will be shown next
    console.log('Next anecdote will be:', anecdotes[randomIndex])

    // Update the selected state with the new random index
    setSelected(randomIndex)

    // Log that we requested React to update the selected anecdote
    console.log('setSelected called with:', randomIndex)
  }

  // Find the highest number of votes from the votes array
  const mostVotes = Math.max(...votes)

  // Log the highest vote count
  console.log('Highest number of votes:', mostVotes)

  // Find the index of the anecdote that has the highest number of votes
  // If multiple anecdotes have the same highest votes, indexOf returns the first one
  const mostVotedIndex = votes.indexOf(mostVotes)

  // Log the index of the anecdote with the most votes
  console.log('Index of anecdote with most votes:', mostVotedIndex)

  // Log the anecdote with the most votes
  console.log('Anecdote with most votes:', anecdotes[mostVotedIndex])

  // Return the JSX that React will show on the browser screen
  return (
    <div>
      {/* This heading introduces the currently displayed anecdote section */}
      <h1>Anecdote of the day</h1>

      {/* This div displays the currently selected anecdote */}
      <div>
        {anecdotes[selected]}
      </div>

      {/* This div displays the vote count of the currently selected anecdote */}
      <div>
        has {votes[selected]} votes
      </div>

      {/* This button votes for the currently selected anecdote */}
      <button onClick={handleVote}>
        vote
      </button>

      {/* This button selects and displays a random anecdote */}
      <button onClick={handleNextAnecdote}>
        next anecdote
      </button>

      {/* This heading introduces the most voted anecdote section */}
      <h1>Anecdote with most votes</h1>

      {/* This div displays the anecdote that currently has the most votes */}
      <div>
        {anecdotes[mostVotedIndex]}
      </div>

      {/* This div displays the highest vote count */}
      <div>
        has {mostVotes} votes
      </div>
    </div>
  )
}

// Export the App component so main.jsx can import and render it
export default App