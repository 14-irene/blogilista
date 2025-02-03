const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const blogs = require('../tests/example_list')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = blogs.map(b => new Blog(b))
  const promiseArray = blogObjects.map(b => b.save())
  await Promise.all(promiseArray)
})
test('six blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })
test('returns six blogs', async () => {
  const res = await api.get('/api/blogs')
  assert.strictEqual(res.body.length, 6)
})
test('identification field is called \'id\'', async () => {
  const res = await api.get('/api/blogs')
  const sch = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    id: String
  })
  const mod = mongoose.model('Blog_validator', sch)
  assert(res.body.every(b => mod.validate(b)))
})

after(async () => {
  await mongoose.connection.close()
})

