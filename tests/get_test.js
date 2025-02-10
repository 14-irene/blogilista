const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const blogs = require('../tests/example_list')
const helper = require('../tests/test_helpers')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(b => new Blog(b))
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
  assert(typeof res.body[0].id !== 'undefined')
})
test('can add a blog after which blog count is 7', async () => {
  await api
    .post('/api/blogs')
    .send(helper.extraBlog)
    .expect(201)
    .expect((res) => res.body === helper.extraBlog) 
  await api
    .get('/api/blogs')
    .expect((res) => res.body.length === 7)
  
})
test('likes default to 0', async () => {
  await api
    .post('/api/blogs')
    .send(helper.extraBlogNoLikes)
    .expect(201)
    .expect((res) => res.body === {...helper.extraBlogNoLikes, likes: 0})
})
test('no title or url returns 400', async () => {
  await api
    .post('/api/blogs')
    .send(helper.extraBlogNoTitle)
    .expect(400)
  await api
    .post('/api/blogs')
    .send(helper.extraBlogNoUrl)
    .expect(400)
})
test('can remove blog by id', async () => {
  const res = await api.get('/api/blogs')
  const target = res.body[0].id
  await api
    .delete(`/api/blogs/${target}`)
    .expect(204)
  await api
    .get('/api/blogs')
    .expect((res) => res.body.length === 6)
})

after(async () => {
  await mongoose.connection.close()
})

