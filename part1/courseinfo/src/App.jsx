import './App.css'

const Hello = ({ name, age }) => {
  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
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
      <Hello name="Vinay" age={29-2} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}

export default App