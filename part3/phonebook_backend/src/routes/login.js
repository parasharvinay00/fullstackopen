const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { JWT_SECRET, TOKEN_EXPIRATION } = require('../config')
const ApiError = require('../utils/ApiError')
const { findUserByIdentifier, toPublicUser } = require('../models/users')

const loginRouter = express.Router()

loginRouter.post('/', async (request, response, next) => {
  try {
    const { identifier, password } = request.body

    if (!identifier || typeof identifier !== 'string' || !password || typeof password !== 'string') {
      throw new ApiError(400, 'identifier and password are required')
    }

    const user = await findUserByIdentifier(identifier)
    const passwordCorrect = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false

    if (!user || !passwordCorrect) {
      throw new ApiError(401, 'invalid credentials')
    }

    const token = jwt.sign(
      { id: user.id, username: user.usernameNormalized },
      JWT_SECRET,
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
