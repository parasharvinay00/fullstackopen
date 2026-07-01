const express = require('express')

const ApiError = require('../utils/ApiError')
const personsModel = require('../models/persons')

const personsRouter = express.Router()

personsRouter.get('/', async (request, response, next) => {
  try {
    const persons = await personsModel.getAll()

    response.json(persons)
  } catch (error) {
    next(error)
  }
})

personsRouter.get('/:id', async (request, response, next) => {
  try {
    const person = await personsModel.getById(request.params.id)

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
    const person = await personsModel.create(request.body)

    response.status(201).json(person)
  } catch (error) {
    next(error)
  }
})

personsRouter.put('/:id', async (request, response, next) => {
  try {
    const person = await personsModel.update(request.params.id, request.body)

    response.json(person)
  } catch (error) {
    next(error)
  }
})

personsRouter.delete('/:id', async (request, response, next) => {
  try {
    await personsModel.remove(request.params.id)

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = personsRouter
