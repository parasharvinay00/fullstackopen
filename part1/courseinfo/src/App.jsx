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
  return (
    <div>
      <h1>Greetings</h1>  
    
      <footer />
    </div>
  )
}
export default App

