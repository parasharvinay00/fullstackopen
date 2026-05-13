import { useState } from 'react'

const App = () => {
  console.log('App: render start')
  const [value, setValue] = useState(10)
  console.log('App: state snapshot', { value })

  console.log('App: rendering JSX')
  return (
    <div>
      {value}
      <button
        onClick={() => {
          console.log('App: reset button clicked')
          setValue(0)
        }}
      >
        reset to zero
      </button>
    </div>
  )
}

export default App
