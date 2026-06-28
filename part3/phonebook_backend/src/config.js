const PORT = Number(process.env.PORT || 3001)
const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '8h'
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10)

const requireJwtSecret = () => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
  }
}

module.exports = {
  FRONTEND_ORIGIN,
  JWT_SECRET,
  PORT,
  SALT_ROUNDS,
  TOKEN_EXPIRATION,
  requireJwtSecret
}
