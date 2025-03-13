const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const userExtractor = require('../utils/middlewares')
const Blog = require('../models/blog')
const User = require('../models/user')
require('express-async-errors')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs).end()
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  if (!req.user) {
    return res.status(401).json({ error: 'no user' })
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes, 
    user: req.user._id
  })
  const savedBlog = await blog.save()
  req.user.blogs = req.user.blogs.concat(savedBlog._id)
  await req.user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog.user._id.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: 'invalid user' })
  }
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const newBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.status(200).json(newBlog).end()
})

module.exports = blogsRouter
