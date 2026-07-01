const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs/promises')
const http = require('http')
const path = require('path')

const app = require('../src/app')
const { dataFile } = require('../src/utils/store')

const baseState = {
  persons: []
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

test('phonebook backend supports plain CRUD', async t => {
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

  const initialListResponse = await createRequest(baseUrl, '/api/persons')
  assert.equal(initialListResponse.status, 200)
  assert.deepEqual(await initialListResponse.json(), [])

  const createResponse = await createRequest(baseUrl, '/api/persons', {
    method: 'POST',
    body: {
      name: 'Grace Hopper',
      number: '123-456789'
    }
  })

  assert.equal(createResponse.status, 201)
  const createdPerson = await createResponse.json()
  assert.equal(createdPerson.name, 'Grace Hopper')
  assert.equal(createdPerson.number, '123-456789')
  assert.ok(createdPerson.id)

  const duplicateResponse = await createRequest(baseUrl, '/api/persons', {
    method: 'POST',
    body: {
      name: 'grace hopper',
      number: '999-999999'
    }
  })

  assert.equal(duplicateResponse.status, 400)
  assert.deepEqual(await duplicateResponse.json(), {
    error: 'name must be unique'
  })

  const updateResponse = await createRequest(baseUrl, `/api/persons/${createdPerson.id}`, {
    method: 'PUT',
    body: {
      name: 'Grace Hopper',
      number: '555-000000'
    }
  })

  assert.equal(updateResponse.status, 200)
  assert.deepEqual(await updateResponse.json(), {
    ...createdPerson,
    number: '555-000000'
  })

  const byIdResponse = await createRequest(baseUrl, `/persons/${createdPerson.id}`)
  assert.equal(byIdResponse.status, 200)
  assert.deepEqual(await byIdResponse.json(), {
    ...createdPerson,
    number: '555-000000'
  })

  const deleteResponse = await createRequest(baseUrl, `/api/persons/${createdPerson.id}`, {
    method: 'DELETE'
  })
  assert.equal(deleteResponse.status, 204)

  const finalListResponse = await createRequest(baseUrl, '/api/persons')
  assert.equal(finalListResponse.status, 200)
  assert.deepEqual(await finalListResponse.json(), [])
})
