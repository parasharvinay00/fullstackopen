const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs/promises')
const http = require('http')
const path = require('path')

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret'
process.env.TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h'

const app = require('../src/app')
const { dataFile } = require('../src/utils/store')

const baseState = {
  persons: [],
  users: []
}

const createRequest = (baseUrl, pathname, options = {}) => {
  const targetUrl = new URL(pathname, baseUrl)
  const headers = options.headers ? { ...options.headers } : {}
  const payload = options.body !== undefined ? JSON.stringify(options.body) : null

  if (payload) {
    headers['content-type'] = 'application/json'
    headers['content-length'] = Buffer.byteLength(payload)
  }

  return new Promise((resolve, reject) => {
    const request = http.request(targetUrl, {
      method: options.method || 'GET',
      headers
    }, response => {
      let responseBody = ''

      response.setEncoding('utf8')
      response.on('data', chunk => {
        responseBody += chunk
      })
      response.on('end', () => {
        resolve({
          status: response.statusCode,
          json: async () => JSON.parse(responseBody || '{}'),
          text: async () => responseBody
        })
      })
    })

    request.on('error', reject)

    if (payload) {
      request.write(payload)
    }

    request.end()
  })
}

test('phonebook backend auth and login flows', async t => {
  const originalDbContents = await fs.readFile(dataFile, 'utf8').catch(() => null)
  const server = http.createServer(app)

  await fs.mkdir(path.dirname(dataFile), { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(baseState, null, 2))
  await new Promise(resolve => server.listen(0, resolve))

  const restoreDb = async () => {
    if (originalDbContents === null) {
      await fs.writeFile(dataFile, JSON.stringify(baseState, null, 2))
      return
    }

    await fs.writeFile(dataFile, originalDbContents)
  }

  t.after(async () => {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
    await restoreDb()
  })

  const address = server.address()
  const baseUrl = `http://127.0.0.1:${address.port}`
  const credentials = {
    username: 'tester',
    name: 'Tester',
    phoneNumber: '9289610693',
    password: 'Test-password1!'
  }

  const registerResponse = await createRequest(baseUrl, '/api/users', {
    method: 'POST',
    body: credentials
  })

  assert.equal(registerResponse.status, 201)
  const registeredUser = await registerResponse.json()
  assert.equal(registeredUser.username, credentials.username)

  const loginByUsernameResponse = await createRequest(baseUrl, '/api/login', {
    method: 'POST',
    body: {
      identifier: credentials.username,
      password: credentials.password
    }
  })

  assert.equal(loginByUsernameResponse.status, 200)
  const loginByUsernameBody = await loginByUsernameResponse.json()
  assert.equal(typeof loginByUsernameBody.token, 'string')
  assert.equal(loginByUsernameBody.user.username, credentials.username)
  assert.equal(loginByUsernameBody.user.phoneNumber, '+919289610693')

  const loginByPhoneResponse = await createRequest(baseUrl, '/api/login', {
    method: 'POST',
    body: {
      identifier: credentials.phoneNumber,
      password: credentials.password
    }
  })

  assert.equal(loginByPhoneResponse.status, 200)
  const loginByPhoneBody = await loginByPhoneResponse.json()
  assert.equal(typeof loginByPhoneBody.token, 'string')

  const unknownIdentifierResponse = await createRequest(baseUrl, '/api/login', {
    method: 'POST',
    body: {
      identifier: 'unknown-user',
      password: credentials.password
    }
  })

  assert.equal(unknownIdentifierResponse.status, 401)
  assert.deepEqual(await unknownIdentifierResponse.json(), {
    error: 'invalid credentials'
  })

  const wrongPasswordResponse = await createRequest(baseUrl, '/api/login', {
    method: 'POST',
    body: {
      identifier: credentials.username,
      password: 'Wrong-password1!'
    }
  })

  assert.equal(wrongPasswordResponse.status, 401)
  assert.deepEqual(await wrongPasswordResponse.json(), {
    error: 'invalid credentials'
  })

  await fs.writeFile(dataFile, JSON.stringify({
    persons: [],
    users: [
      {
        id: 'malformed-user',
        username: 'legacy-user',
        usernameNormalized: 'legacy-user',
        phoneNumber: '+919111111111'
      }
    ]
  }, null, 2))

  const missingPasswordHashResponse = await createRequest(baseUrl, '/api/login', {
    method: 'POST',
    body: {
      identifier: 'legacy-user',
      password: credentials.password
    }
  })

  assert.equal(missingPasswordHashResponse.status, 401)
  assert.deepEqual(await missingPasswordHashResponse.json(), {
    error: 'invalid credentials'
  })

  const missingIdentifierResponse = await createRequest(baseUrl, '/api/login', {
    method: 'POST',
    body: {
      password: credentials.password
    }
  })

  assert.equal(missingIdentifierResponse.status, 400)
  assert.deepEqual(await missingIdentifierResponse.json(), {
    error: 'identifier is required'
  })

  const missingPasswordResponse = await createRequest(baseUrl, '/api/login', {
    method: 'POST',
    body: {
      identifier: credentials.username
    }
  })

  assert.equal(missingPasswordResponse.status, 400)
  assert.deepEqual(await missingPasswordResponse.json(), {
    error: 'password is required'
  })

  await fs.writeFile(dataFile, JSON.stringify({
    persons: []
  }, null, 2))

  const missingUsersCollectionResponse = await createRequest(baseUrl, '/api/login', {
    method: 'POST',
    body: {
      identifier: credentials.username,
      password: credentials.password
    }
  })

  assert.equal(missingUsersCollectionResponse.status, 401)
  assert.deepEqual(await missingUsersCollectionResponse.json(), {
    error: 'invalid credentials'
  })

  await fs.writeFile(dataFile, JSON.stringify({
    persons: [],
    users: {}
  }, null, 2))

  const malformedUsersCollectionResponse = await createRequest(baseUrl, '/api/login', {
    method: 'POST',
    body: {
      identifier: credentials.username,
      password: credentials.password
    }
  })

  assert.equal(malformedUsersCollectionResponse.status, 401)
  assert.deepEqual(await malformedUsersCollectionResponse.json(), {
    error: 'invalid credentials'
  })

  await fs.writeFile(dataFile, JSON.stringify(baseState, null, 2))

  const secondRegisterResponse = await createRequest(baseUrl, '/api/users', {
    method: 'POST',
    body: credentials
  })

  assert.equal(secondRegisterResponse.status, 201)

  const secondLoginResponse = await createRequest(baseUrl, '/api/login', {
    method: 'POST',
    body: {
      identifier: credentials.username,
      password: credentials.password
    }
  })

  assert.equal(secondLoginResponse.status, 200)
  const secondLoginBody = await secondLoginResponse.json()

  const personsWithoutTokenResponse = await createRequest(baseUrl, '/api/persons')

  assert.equal(personsWithoutTokenResponse.status, 401)
  assert.deepEqual(await personsWithoutTokenResponse.json(), {
    error: 'token missing'
  })

  const personsWithTokenResponse = await createRequest(baseUrl, '/api/persons', {
    headers: {
      authorization: `Bearer ${secondLoginBody.token}`
    }
  })

  assert.equal(personsWithTokenResponse.status, 200)
  assert.deepEqual(await personsWithTokenResponse.json(), [])

  const infoResponse = await createRequest(baseUrl, '/info')

  assert.equal(infoResponse.status, 200)
  const infoBody = await infoResponse.text()
  assert.match(infoBody, /Phonebook has info for 0 contacts/)
})
