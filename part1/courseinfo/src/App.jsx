import './App.css'

const Hello = (props) => {
  return (
    <div>

      <p>Hello {props.name}</p>
    </div>
  )
}
const App = () => {
  return (
    <div>
      <h1>Greetings</h1>

      <Hello name='Sahil' />
      <Hello name='Vinay' />
    </div>
  )
}
export default App

