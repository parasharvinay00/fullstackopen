import { useState } from 'react'

const History = ({ allClicks }) => {
  console.log('History: render start', { allClicks })

  if (allClicks.length === 0) {
    console.log('History: no clicks branch')
    return <div>the app is used by pressing the buttons</div>
  }

  console.log('History: rendering click history', { history: allClicks.join(' ') })
  return <div>button press history: {allClicks.join(' ')}</div>
}

const Button = ({ onClick, text }) => {
  console.log('Button: render', { text })
  return <button onClick={onClick}>{text}</button>
}
const App = () => {
  console.log('App: render start')
  const [value, setValue] = useState(10)
  console.log('App: state initialized', { value, setValue })

  console.log('App: rendering JSX', { value })
  return (
    <div>
      {value}
      <button>reset to zero</button>
    </div>
  )
}

export default App
