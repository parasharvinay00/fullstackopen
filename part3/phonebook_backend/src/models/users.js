const { randomUUID } = require('crypto')

const bcrypt = require('bcryptjs')

const { SALT_ROUNDS } = require('../config')
const ApiError = require('../utils/ApiError')
const { normalizeIndianPhoneNumber, tryNormalizeIndianPhoneNumber } = require('../utils/phoneNumbers')
const { validatePasswordStrength } = require('../utils/passwords')
const db = require('../utils/store')

const normalizeUsername = username => username.trim().toLowerCase()

const toPublicUser = user => ({
  id: user.id,
  username: user.username,
  phoneNumber: user.phoneNumber
})

const validateUserInput = async ({ username, phoneNumber, password }) => {
  if (!username || typeof username !== 'string' || !username.trim()) {
    throw new ApiError(400, 'username is required')
  }

  const trimmedUsername = username.trim()

  if (trimmedUsername.length < 3) {
    throw new ApiError(400, 'username must be at least 3 characters long')
  }

  if (!phoneNumber || typeof phoneNumber !== 'string') {
    throw new ApiError(400, 'phone number is required')
  }

  if (!password || typeof password !== 'string') {
    throw new ApiError(400, 'password is required')
  }

  validatePasswordStrength(password)

  const normalizedPhoneNumber = normalizeIndianPhoneNumber(phoneNumber)
  const usernameNormalized = normalizeUsername(trimmedUsername)
  const state = await db.read()

  if (state.users.some(user => user.usernameNormalized === usernameNormalized)) {
    throw new ApiError(409, 'username already exists')
  }

  if (state.users.some(user => user.phoneNumber === normalizedPhoneNumber)) {
    throw new ApiError(409, 'phone number already exists')
  }

  return {
    normalizedPhoneNumber,
    trimmedUsername,
    usernameNormalized
  }
}

const createUser = async ({ username, phoneNumber, password }) => {
  const {
    normalizedPhoneNumber,
    trimmedUsername,
    usernameNormalized
  } = await validateUserInput({ username, phoneNumber, password })
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  const newUser = {
    id: randomUUID(),
    username: trimmedUsername,
    usernameNormalized,
    phoneNumber: normalizedPhoneNumber,
    passwordHash
  }

  await db.update(state => ({
    ...state,
    users: state.users.concat(newUser)
  }))

  return toPublicUser(newUser)
}

const findUserByIdentifier = async identifier => {
  const trimmedIdentifier = typeof identifier === 'string' ? identifier.trim() : ''

  if (!trimmedIdentifier) {
    return null
  }

  const state = await db.read()
  const normalizedIdentifier = trimmedIdentifier.toLowerCase()
  const byUsername = state.users.find(user => user.usernameNormalized === normalizedIdentifier)

  if (byUsername) {
    return byUsername
  }

  const normalizedPhone = tryNormalizeIndianPhoneNumber(trimmedIdentifier)

  if (!normalizedPhone) {
    return null
  }

  return state.users.find(user => user.phoneNumber === normalizedPhone) || null
}

const findUserById = async id => {
  const state = await db.read()

  return state.users.find(user => user.id === id) || null
}

module.exports = {
  createUser,
  findUserById,
  findUserByIdentifier,
  normalizeUsername,
  toPublicUser
}
