import { useState } from 'react'

const Statistics = ({ good, neutral, bad, total, average, positive }) => {
  console.log('Statistics rendered', { good, neutral, bad, total, average, positive })

  return (
    <div>
      <h1>statistics</h1>

      <div>good {good}</div>
      <div>neutral {neutral}</div>
      <div>bad {bad}</div>
      <div>all {total}</div>
      <div>average {average}</div>
      <div>positive {positive} %</div>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    console.log('Good button clicked', { previousGood: good, nextGood: good + 1 })
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    console.log('Neutral button clicked', { previousNeutral: neutral, nextNeutral: neutral + 1 })
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    console.log('Bad button clicked', { previousBad: bad, nextBad: bad + 1 })
    setBad(bad + 1)
  }

  const total = good + neutral + bad

  const average = total === 0
    ? 0
    : (good - bad) / total

  const positive = total === 0
    ? 0
    : (good / total) * 100

  console.log('App rendered', { good, neutral, bad, total, average, positive })

  return (
    <div>
      <h1>give feedback</h1>

      <button onClick={handleGoodClick}>
        good
      </button>

      <button onClick={handleNeutralClick}>
        neutral
      </button>

      <button onClick={handleBadClick}>
        bad
      </button>

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
