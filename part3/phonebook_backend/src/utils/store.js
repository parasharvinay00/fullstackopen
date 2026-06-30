const fs = require('fs/promises')
const path = require('path')

const dataDirectory = path.join(__dirname, '..', '..', 'data')
const dataFile = path.join(dataDirectory, 'db.json')

const legacyPersons = [
  {
    id: 'legacy-1',
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 'legacy-2',
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 'legacy-3',
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 'legacy-4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

const initialState = {
  persons: [],
  users: []
}

const coerceCollection = value => (Array.isArray(value) ? value : [])

const coerceState = state => {
  const safeState = state && typeof state === 'object' ? state : {}

  return {
    ...safeState,
    legacyPersons: Array.isArray(safeState.legacyPersons)
      ? safeState.legacyPersons
      : legacyPersons,
    persons: coerceCollection(safeState.persons),
    users: coerceCollection(safeState.users)
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
