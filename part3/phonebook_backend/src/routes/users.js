const express = require('express')

const usersModel = require('../models/users')

const usersRouter = express.Router()

usersRouter.post('/', async (request, response, next) => {
  try {
    const user = await usersModel.createUser(request.body)

    response.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
