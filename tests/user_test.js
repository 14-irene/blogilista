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
    await api
      .post('/api/users')
      .send(helpers.exampleUser)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helpers.usersInDb()
    assert(usersAtEnd.length === usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(helpers.exampleUser.username))
  })
  
  test('creation fails with proper status code and message if username is not unique', async () => {
    const usersAtStart = await helpers.usersInDb()

    const result = await api
      .post('/api/users')
      .send(helpers.rootUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helpers.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert(usersAtEnd.length === usersAtStart.length)
  })
})
describe('when db is empty', async () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })
  
  test('creation fails with proper status code when username is too short or undefined', async () => {
    const usersAtStart = await helpers.usersInDb()
    const shortUsername = await api
      .post('/api/users')
      .send({ username: 'ab', password: 'salainen' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const undefinedUsername = await api
      .post('/api/users')
      .send({ name: 'test', password: 'salainen' })
      .expect(400)
      .expect( 'Content-Type', /application\/json/)
    assert([shortUsername, undefinedUsername].every(u => u.body.error.includes('bad username')))
  })
  test('creation fails with proper status code when password is too short or undefined', async () => {
    const usersAtStart = await helpers.usersInDb()
    const shortPassword = await api
      .post('/api/users')
      .send({ username: 'user1', password: '12' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const undefinedPassword = await api
      .post('/api/users')
      .send({ username: 'user2' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert([shortPassword, undefinedPassword].every(p => p.body.error.includes('bad password')))
  })
})

after(async () => {
  await mongoose.connection.close()
})
