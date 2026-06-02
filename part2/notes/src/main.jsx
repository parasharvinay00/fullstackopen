
import ReactDOM from 'react-dom/client'
import App from './App'
import axios from 'axios'
const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Love is everything',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]


ReactDOM.createRoot(document.getElementById('root')).render(
  <App notes={notes} />
)


const promise1 = axios.get('http://localhost:3001/notes')
console.log(promise1)

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)

const promise3 = axios.get('http://localhost:3001/notes')

promise3.then(response => {
  console.log(response)
})  