const fs = require('fs/promises')
const path = require('path')

const dataDirectory = path.join(__dirname, '..', '..', 'data')
const dataFile = path.join(dataDirectory, 'db.json')

const initialState = {
  persons: []
}

const coerceCollection = value => (Array.isArray(value) ? value : [])

const coerceState = state => {
  const safeState = state && typeof state === 'object' ? state : {}
  const persons = coerceCollection(safeState.persons).map(person => ({
    id: person.id,
    name: typeof person.name === 'string' ? person.name : '',
    number: typeof person.number === 'string' ? person.number : ''
  }))

  return {
    persons
  }
}

let pendingWrite = Promise.resolve()

const ensureStore = async () => {
  await fs.mkdir(dataDirectory, { recursive: true })

  try {
    await fs.access(dataFile)
  } catch (error) {
    await fs.writeFile(dataFile, JSON.stringify(initialState, null, 2))
  }
}

const read = async () => {
  await ensureStore()
  const raw = await fs.readFile(dataFile, 'utf8')

  if (!raw.trim()) {
    return coerceState(initialState)
  }

  return coerceState(JSON.parse(raw))
}

const update = async updater => {
  const nextWrite = pendingWrite.then(async () => {
    const currentState = await read()
    const nextState = coerceState(await updater(currentState))

    await fs.writeFile(dataFile, JSON.stringify(nextState, null, 2))

    return nextState
  })

  pendingWrite = nextWrite.catch(() => undefined)

  return nextWrite
}

module.exports = {
  coerceState,
  dataFile,
  read,
  update
}
