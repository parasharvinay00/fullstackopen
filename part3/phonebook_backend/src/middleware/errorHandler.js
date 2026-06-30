const { ConfigurationError } = require('../config')
const ApiError = require('../utils/ApiError')

const errorHandler = (error, request, response, next) => {
  if (error instanceof ApiError) {
    return response.status(error.statusCode).json({
      error: error.message
    })
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  if (error instanceof ConfigurationError) {
    console.error(error.stack || error)

    return response.status(500).json({
      error: 'internal server error'
    })
  }

  console.error(error.stack || error)

  return response.status(500).json({
    error: 'internal server error'
  })
}

module.exports = errorHandler
