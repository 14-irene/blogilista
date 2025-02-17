const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users).end()
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  if (username === undefined || !(/\w{3,}/.test(username))) {
    res.status(400).json({ error: 'bad username' })
  } 
  else if (password === undefined || !(/\w{3,}/.test(password))) {
    res.status(400).json({ error: 'bad password' })
  }
  else {

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({ username, name, passwordHash })
    const savedUser = await user.save()
    
    res.status(201).json(savedUser)
  }
})

module.exports = usersRouter
