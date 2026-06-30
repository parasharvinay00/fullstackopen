const express = require('express')
const jwt = require('jsonwebtoken')

const { getJwtSecret, TOKEN_EXPIRATION } = require('../config')
const ApiError = require('../utils/ApiError')
const { findUserByIdentifier, toPublicUser } = require('../models/users')
const { comparePassword } = require('../utils/passwords')

const loginRouter = express.Router()

loginRouter.post('/', async (request, response, next) => {
  try {
    const { identifier, password } = request.body || {}

    if (typeof identifier !== 'string' || !identifier.trim()) {
      throw new ApiError(400, 'identifier is required')
    }

    if (typeof password !== 'string' || !password.trim()) {
      throw new ApiError(400, 'password is required')
    }

    const user = await findUserByIdentifier(identifier)
    const passwordCorrect = await comparePassword(password, user?.passwordHash)

    if (!user || !passwordCorrect) {
      throw new ApiError(401, 'invalid credentials')
    }

    const token = jwt.sign(
      { id: user.id, username: user.usernameNormalized },
      getJwtSecret(),
      { expiresIn: TOKEN_EXPIRATION }
    )

    response.json({
      token,
      user: toPublicUser(user)
    })
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter
