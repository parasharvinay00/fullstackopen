const ApiError = require('./ApiError')

const normalizeIndianPhoneNumber = value => {
  const normalizedValue = typeof value === 'string' ? value.trim() : ''

  if (!normalizedValue) {
    throw new ApiError(400, 'phone number is required')
  }

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

  throw new ApiError(
    400,
    'Phone number must be a valid Indian mobile number'
  )
}

const tryNormalizeIndianPhoneNumber = value => {
  try {
    return normalizeIndianPhoneNumber(value)
  } catch (error) {
    return null
  }
}

module.exports = {
  normalizeIndianPhoneNumber,
  tryNormalizeIndianPhoneNumber
}
