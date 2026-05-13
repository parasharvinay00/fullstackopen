import { useEffect, useState } from 'react'

const App = () => {
  console.log('App: render start')
  const [value, setValue] = useState(10)
  console.log('App: state snapshot during render', { value })

  useEffect(() => {
    console.log('App: value state changed', { value })
  }, [value])

  console.log('App: rendering JSX')
  return (
    <div>
      <p>App.jsx updated</p>
      {value}
      <button
        onClick={() => {
          console.log('App: reset button clicked', {
            previousValue: value,
            nextValue: 0,
          })
          setValue(0)
        }}
      >
        reset to zero
      </button>
    </div>
  )
}

export default App
