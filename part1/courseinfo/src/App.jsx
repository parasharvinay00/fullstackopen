import { useState } from 'react'

const History = ({ allClicks }) => {
  if (allClicks.length === 0) {
    return <div>the app is used by pressing the buttons</div>
  }

  return <div>button press history: {allClicks.join(' ')}</div>
}

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>
}

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAllClicks] = useState([])

  const handleLeftClick = () => {
    setAllClicks((prev) => prev.concat('L'))
    setLeft((prev) => prev + 1)
  }

  const handleRightClick = () => {
    setAllClicks((prev) => prev.concat('R'))
    setRight((prev) => prev + 1)
  }

  return (
    <div>
      {left}
      <Button onClick={handleLeftClick} text="left" />
      <Button onClick={handleRightClick} text="right" />
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}

export default App
