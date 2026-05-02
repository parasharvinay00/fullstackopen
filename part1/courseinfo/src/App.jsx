import './App.css'

const Namaste = ({ name, age }) => {
  console.log('namaste')
  return (
    <div>
      <p>
        Namaste {name}, you are {age} years old
      </p>
    </div>
  )
}

const Footer = () => {
  
  console.log('footer')
return (
    <div>
      greeting app created by{' '}
      <a href="https://fullstackopen.com/en/">
        Full Stack Open
      </a>
    </div>
  )
}
const App = () => {
  const friends = [
    { name: 'Peter', age: 4 },
    { name: 'Maya', age: 10 },
  ]

  return (
    <div>
      <p>{friends[0].name} {friends[0].age}</p>
      <p>{friends[1].name} {friends[1].age}</p>
    </div>
  )
}

export default App




