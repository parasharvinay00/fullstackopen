import { useState } from 'react'

// This component renders one reusable button for a feedback option.
const Button = ({ onClick, text }) => {
  console.log('Rendering Button', { text })

  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

// This component shows one row in the statistics list.
const StatisticLine = ({ text, value }) => {
  console.log('Rendering StatisticLine', { text, value })

  return (
    <div>
      {text} {value}
    </div>
  )
}

// This component decides whether to show the empty state or the computed results.
const Statistics = ({ good, neutral, bad, total, average, positive }) => {
  console.log('Rendering Statistics', { good, neutral, bad, total, average, positive })

  // This branch tells the user that no feedback has been submitted yet.
  if (total === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <div>No feedback given</div>
      </div>
    )
  }

  // This branch renders all calculated feedback values once feedback exists.
  return (
    <div>
      <h1>statistics</h1>

      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={total} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={`${positive} %`} />
    </div>
  )
}

// This component stores the feedback state and builds the full feedback interface.
const App = () => {
  // These state values keep track of how many times each feedback type was chosen.
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // This value counts all submitted feedback entries.
  const total = good + neutral + bad

  // This value calculates the average score based on good and bad feedback.
  const average = total === 0
    ? 0
    : (good - bad) / total

  // This value calculates the percentage of positive feedback.
  const positive = total === 0
    ? 0
    : (good / total) * 100

  console.log('Rendering App', { good, neutral, bad, total, average, positive })

  // This handler increases the good feedback count when the good button is clicked.
  const handleGoodClick = () => {
    const nextGood = good + 1
    console.log('Good feedback clicked', { previousGood: good, nextGood })
    setGood(nextGood)
  }

  // This handler increases the neutral feedback count when the neutral button is clicked.
  const handleNeutralClick = () => {
    const nextNeutral = neutral + 1
    console.log('Neutral feedback clicked', { previousNeutral: neutral, nextNeutral })
    setNeutral(nextNeutral)
  }

  // This handler increases the bad feedback count when the bad button is clicked.
  const handleBadClick = () => {
    const nextBad = bad + 1
    console.log('Bad feedback clicked', { previousBad: bad, nextBad })
    setBad(nextBad)
  }

  // This JSX renders the feedback buttons and passes the calculated values to the statistics view.
  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </div>
  )
}

export default App
