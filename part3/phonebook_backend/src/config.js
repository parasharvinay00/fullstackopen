const PORT = Number(process.env.PORT || 3001)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || ''

const getFrontendOrigins = () => {
  return (process.env.FRONTEND_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
}

module.exports = {
  PORT,
  FRONTEND_ORIGIN,
  getFrontendOrigins
}
