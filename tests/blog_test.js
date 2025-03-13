const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogs = require('../tests/example_list')
const helper = require('../tests/test_helpers')

const api = supertest(app)
let token = ''

describe('when there is initially some saved blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const ret = await api.post('/api/users').send(helper.rootUser)
    const user = ret.body
    const res = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
    token = res.body.token
    const blogObjects = helper.initialBlogs.map(b => new Blog({...b, user: user.id}))
    const promiseArray = await blogObjects.map(b => b.save())
    await Promise.all(promiseArray)
  })

  describe('getting all blogs', () => {
    test('blogs are returned as json', async () => {
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
  })
  describe('adding a blog', () => {
    test('can add a blog after which blog count is 7', async () => {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.extraBlog)
        .expect(201)
        .expect((res) => res.body === helper.extraBlog) 
      await api
        .get('/api/blogs')
        .expect((res) => assert(res.body.length === 7))
      
    })
    test('likes default to 0', async () => {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.extraBlogNoLikes)
        .expect(201)
        .expect((res) => assert(res.body.likes === 0))
    })
    test('no title or url returns 400', async () => {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.extraBlogNoTitle)
        .expect(400)
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.extraBlogNoUrl)
        .expect(400)
    })
    test('no authorization token returns 401', async () => {
      await api
        .post('/api/blogs')
        .send(helper.extraBlog)
        .expect(401)
    })
  })

  test('can remove blog by id', async () => {
    const r = await api.get('/api/blogs')
    const target = r.body[0].id
    await api
      .delete(`/api/blogs/${target}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
      .expect(() => assert(r.body.length - 1 === 5))
    await api
      .get('/api/blogs')
      .expect((res) => assert(res.body.length === 5))
  })
  test('fails when token is faulty', async () => {
    const r = await api.get('/api/blogs')
    const target = r.body[0].id
    await api
      .delete(`/api/blogs/${target}`)
      .set('Authorization', `Bearer ${token}a`)
      .expect(400)
  })
  test('can edit blog likes', async () => {
    const r = await api.get('/api/blogs')
    const likes = r.body[0].likes
    const id = r.body[0].id
    await api
      .put(`/api/blogs/${id}`)
      .send({ likes: 1 })
      .expect(200)
      .expect((res) => assert(res.body.likes === 1))
  })
})

after(async () => {
  await mongoose.connection.close()
})

