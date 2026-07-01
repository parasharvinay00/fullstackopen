const ApiError = require('../utils/ApiError')

const errorHandler = (error, request, response, next) => {
  if (error instanceof ApiError) {
    return response.status(error.statusCode).json({
      error: error.message
    })
  }

  console.error(error.stack || error)

  return response.status(500).json({
    error: 'internal server error'
  })
}

module.exports = errorHandler
