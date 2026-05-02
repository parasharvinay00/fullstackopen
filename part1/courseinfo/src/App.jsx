import './App.css'

const Namaste = ({ name, age }) => {
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
      <a href="https://fullstackopen.com/en/" target="_blank" rel="noreferrer">
        Full Stack Open
      </a>
    </div>
  )
}

const App = () => {
  const name = 'Sahil'
  const age = 29

  return (
    <>
      <h1>Greetings</h1>
      <Namaste name="Vinay" age={29-2} />
      <Namaste name={name} age={age} />
      <Footer />
    </>
  )
}

export default App