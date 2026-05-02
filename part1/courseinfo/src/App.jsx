import './App.css'


const footer = () => {
  console.log('footer') 
  return (
    <div>
      greeting app created by <a href='https://github.com/mluukkai'>mluukkai</a>
    </div>
  )
}
const App = () => {
  const name = 'Peter'
  const age = 10

  return (   
    <>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} />
      <Hello name={name} age={age} />
      <footer />
    </> 
  )
}
export default App

