const ApiError = require('./ApiError')

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

const validatePasswordStrength = password => {
  if (!PASSWORD_RULE.test(password)) {
    throw new ApiError(
      400,
      'Password must contain uppercase, lowercase, number, and special character'
    )
  }
}

module.exports = {
  PASSWORD_RULE,
  validatePasswordStrength
}
