const { randomUUID } = require('crypto')

const ApiError = require('../utils/ApiError')
const db = require('../utils/store')

const sanitizePersonInput = person => ({
  name: typeof person.name === 'string' ? person.name.trim() : '',
  number: typeof person.number === 'string' ? person.number.trim() : ''
})

const validatePersonInput = async ({ name, number }, existingPersonId = null) => {
  if (!name || !number) {
    throw new ApiError(400, 'name and number are required')
  }

  const state = await db.read()
  const normalizedName = name.trim().toLowerCase()
  const duplicateName = state.persons.find(person =>
    person.name.trim().toLowerCase() === normalizedName &&
    person.id !== existingPersonId
  )

  if (duplicateName) {
    throw new ApiError(400, 'name must be unique')
  }
}

const getAll = async () => {
  const state = await db.read()

  return state.persons
}

const getById = async id => {
  const state = await db.read()

  return state.persons.find(person => person.id === id) || null
}

const create = async personInput => {
  const person = sanitizePersonInput(personInput)
  const newPerson = {
    id: randomUUID(),
    name: person.name,
    number: person.number
  }

  await validatePersonInput(person)

  await db.update(state => ({
      ...state,
      persons: state.persons.concat(newPerson)
  }))

  return newPerson
}

const update = async (id, personInput) => {
  const person = sanitizePersonInput(personInput)
  const existingPerson = await getById(id)

  if (!existingPerson) {
    throw new ApiError(404, 'person not found')
  }

  await validatePersonInput(person, id)

  const nextPerson = {
    ...existingPerson,
    name: person.name,
    number: person.number
  }

  await db.update(state => ({
    ...state,
    persons: state.persons.map(currentPerson =>
      currentPerson.id === id ? nextPerson : currentPerson
    )
  }))

  return nextPerson
}

const remove = async id => {
  const existingPerson = await getById(id)

  if (!existingPerson) {
    throw new ApiError(404, 'person not found')
  }

  await db.update(state => ({
    ...state,
    persons: state.persons.filter(person => person.id !== id)
  }))
}

module.exports = {
  create,
  getAll,
  getById,
  remove,
  update
}
