const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const MIN_LENGTH = 3

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    response.status(400).json({ error: 'missing arguments. username and password must be provided' }).end()
  } else if (username.length < MIN_LENGTH || password.length < MIN_LENGTH) {
    response.status(400).json({ error: 'parameters should be at least 3 characters long' }).end()
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  }

})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs',{ url: 1, title: 1, author: 1 })

  response.json(users)
})

module.exports = usersRouter