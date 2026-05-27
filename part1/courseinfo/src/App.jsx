import { useState } from 'react'


const Display = props => <div>{props.value}</div>

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)
  //Using this statement we can simply call setValue(123) to set the state directly.
   Object.assign(window, { setValue })

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      <Display value={value} />
      <Button onClick={() => setToValue(1000)} text="thousand" />
      <Button onClick={() => setToValue(0)} text="reset" />
      <Button onClick={() => setToValue(value + 1)} text="increment" />
      <Button onClick={() => setToValue(value - 1)} text="decrement" />
      <Button onClick={() => setToValue(value * 2)} text="double" />
    </div>
  )
}
export default App