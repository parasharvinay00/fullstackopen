const { randomUUID } = require('crypto')

const ApiError = require('../utils/ApiError')
const db = require('../utils/store')

const sanitizePersonInput = person => ({
  name: typeof person.name === 'string' ? person.name.trim() : '',
  number: typeof person.number === 'string' ? person.number.trim() : ''
})

const validatePersonInput = async ({ name, number }, userId, existingPersonId = null) => {
  if (!name) {
    throw new ApiError(400, 'name is missing')
  }

  if (!number) {
    throw new ApiError(400, 'number is missing')
  }

  const state = await db.read()
  const duplicateName = state.persons.find(person =>
    person.user === userId &&
    person.name.toLowerCase() === name.toLowerCase() &&
    person.id !== existingPersonId
  )

  if (duplicateName) {
    throw new ApiError(400, 'name must be unique')
  }
}

const getAllByUser = async userId => {
  const state = await db.read()

  return state.persons.filter(person => person.user === userId)
}

const getByIdForUser = async (id, userId) => {
  const state = await db.read()

  return state.persons.find(person => person.id === id && person.user === userId) || null
}

const createForUser = async (personInput, userId) => {
  const person = sanitizePersonInput(personInput)
  const newPerson = {
    id: randomUUID(),
    name: person.name,
    number: person.number,
    user: userId
  }

  await validatePersonInput(person, userId)

  await db.update(state => ({
      ...state,
      persons: state.persons.concat(newPerson)
  }))

  return newPerson
}

const updateForUser = async (id, personInput, userId) => {
  const person = sanitizePersonInput(personInput)
  const existingPerson = await getByIdForUser(id, userId)

  if (!existingPerson) {
    throw new ApiError(404, 'person not found')
  }

  await validatePersonInput(person, userId, id)

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

const removeForUser = async (id, userId) => {
  const existingPerson = await getByIdForUser(id, userId)

  if (!existingPerson) {
    throw new ApiError(404, 'person not found')
  }

  await db.update(state => ({
    ...state,
    persons: state.persons.filter(person => person.id !== id)
  }))
}

module.exports = {
  createForUser,
  getAllByUser,
  getByIdForUser,
  removeForUser,
  updateForUser
}
