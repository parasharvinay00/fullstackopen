const redactValue = value => {
  if (Array.isArray(value)) {
    return value.map(redactValue)
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((safeObject, [key, nestedValue]) => {
      if (['password', 'passwordHash', 'token', 'authorization'].includes(key)) {
        return {
          ...safeObject,
          [key]: '[REDACTED]'
        }
      }

      return {
        ...safeObject,
        [key]: redactValue(nestedValue)
      }
    }, {})
  }

  return value
}

const createSafeBodySnapshot = body => redactValue(body || {})

module.exports = {
  createSafeBodySnapshot
}
