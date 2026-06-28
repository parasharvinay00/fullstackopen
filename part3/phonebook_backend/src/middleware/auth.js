const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../config')
const ApiError = require('../utils/ApiError')

const getTokenFrom = request => {
  const authorization = request.get('authorization')

  if (!authorization) {
    return null
  }

  if (!authorization.toLowerCase().startsWith('bearer ')) {
    throw new ApiError(401, 'invalid token')
  }

  return authorization.substring(7)
}

const requireAuth = (request, response, next) => {
  try {
    const token = getTokenFrom(request)

    if (!token) {
      throw new ApiError(401, 'token missing')
    }

    const decodedToken = jwt.verify(token, JWT_SECRET)

    if (!decodedToken.id) {
      throw new ApiError(401, 'invalid token')
    }

    request.authenticatedUserId = decodedToken.id
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getTokenFrom,
  requireAuth
}
