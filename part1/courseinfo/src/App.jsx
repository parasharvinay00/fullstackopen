import { useState } from 'react'

const App = () => {
  const [value, setValue] = useState(10)

  return (
    <div>
      {value}
      <button onClick={() => setValue(0)}>
        reset to zero
      </button>
    </div>
  )
}

export default App
