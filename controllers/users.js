const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('blogs', 
      { url: 1, title: 1, author: 1, id: 1 })
  res.json(users)
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

usersRouter.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.status(204)
})

module.exports = usersRouter
