import './App.css'

const App = () => {
  const now = new Date()
  const a = 1
  const b = 10
  console.log(now, a+b)

  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>
        {a} plus {b} is {a + b}
      </p>
    </div>
  )
}

export default App

