class ConfigurationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ConfigurationError'
  }
}

const PORT = Number(process.env.PORT || 3001)
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '8h'
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10)

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET || !process.env.JWT_SECRET.trim()) {
    throw new ConfigurationError('JWT_SECRET environment variable is required')
  }

  return process.env.JWT_SECRET
}

const requireJwtSecret = () => {
  getJwtSecret()
}

module.exports = {
  ConfigurationError,
  FRONTEND_ORIGIN,
  PORT,
  SALT_ROUNDS,
  getJwtSecret,
  TOKEN_EXPIRATION,
  requireJwtSecret
}
