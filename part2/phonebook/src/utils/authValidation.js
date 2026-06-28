const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

const normalizeIndianPhoneNumber = value => {
  const normalizedValue = typeof value === 'string' ? value.trim() : ''
  const compactValue = normalizedValue.replace(/[\s()-]/g, '')

  if (/^[6-9]\d{9}$/.test(compactValue)) {
    return `+91${compactValue}`
  }

  if (/^91[6-9]\d{9}$/.test(compactValue)) {
    return `+${compactValue}`
  }

  if (/^\+91[6-9]\d{9}$/.test(compactValue)) {
    return compactValue
  }

  return null
}

const validateRegistration = values => {
  const username = values.username.trim()

  if (!username) {
    return 'Username is required'
  }

  if (username.length < 3) {
    return 'Username must be at least 3 characters long'
  }

  if (!values.phoneNumber.trim()) {
    return 'Phone number is required'
  }

  if (!normalizeIndianPhoneNumber(values.phoneNumber)) {
    return 'Phone number must be a valid Indian mobile number'
  }

  if (!values.password) {
    return 'Password is required'
  }

  if (!passwordRule.test(values.password)) {
    return 'Password must contain uppercase, lowercase, number, and special character'
  }

  if (values.password !== values.confirmPassword) {
    return 'Passwords do not match'
  }

  return null
}

const validateLogin = values => {
  if (!values.identifier.trim()) {
    return 'Username or phone number is required'
  }

  if (!values.password) {
    return 'Password is required'
  }

  return null
}

export {
  normalizeIndianPhoneNumber,
  validateLogin,
  validateRegistration,
}
