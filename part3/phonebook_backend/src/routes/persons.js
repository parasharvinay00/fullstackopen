const express = require('express')

const ApiError = require('../utils/ApiError')
const personsModel = require('../models/persons')

const personsRouter = express.Router()

personsRouter.get('/', async (request, response, next) => {
  try {
    const persons = await personsModel.getAllByUser(request.authenticatedUserId)

    response.json(persons)
  } catch (error) {
    next(error)
  }
})

personsRouter.get('/:id', async (request, response, next) => {
  try {
    const person = await personsModel.getByIdForUser(request.params.id, request.authenticatedUserId)

    if (!person) {
      throw new ApiError(404, 'person not found')
    }

    response.json(person)
  } catch (error) {
    next(error)
  }
})

personsRouter.post('/', async (request, response, next) => {
  try {
    const person = await personsModel.createForUser(request.body, request.authenticatedUserId)

    response.status(201).json(person)
  } catch (error) {
    next(error)
  }
})

personsRouter.put('/:id', async (request, response, next) => {
  try {
    const person = await personsModel.updateForUser(
      request.params.id,
      request.body,
      request.authenticatedUserId
    )

    response.json(person)
  } catch (error) {
    next(error)
  }
})

personsRouter.delete('/:id', async (request, response, next) => {
  try {
    await personsModel.removeForUser(request.params.id, request.authenticatedUserId)

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = personsRouter
