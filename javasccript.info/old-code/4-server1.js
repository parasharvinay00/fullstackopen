
const express = require('express')
const app = express()
const port = 3000

const jsonData = [{a: 10}]

app.get('/', (req, res) => {
  res.send('Hello World 123!')
})

app.get('/contact', (req, res) => {
  res.send('Phone number: 123')
})

app.get('/data', (req, res) => {
  res.send(jsonData)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})