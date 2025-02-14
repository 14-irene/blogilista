const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helpers = require('./test_helpers')

const api = supertest(app)

describe('when there is one initial user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('can create with unique username', async () => {
    const usersAtStart = await helpers.usersInDb()
    const newUser = {
      username: 'esimerkki',
      name: 'Essi Esimerkki',
      password: 'salainen'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helpers.usersInDb()
    assert(usersAtEnd.length === usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  
  test('creation fails with proper status code and message if username is not unique', async () => {
    const usersAtStart = await helpers.usersInDb()

    const result = await api
      .post('/api/users')
      .send(helpers.exampleUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helpers.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert(usersAtEnd.length === usersAtStart.length + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
