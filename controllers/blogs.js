const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
require('express-async-errors')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs).end()
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const res = await blog.save()
  response.status(201).json(res).end()
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const newBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(newBlog).end()
})

module.exports = blogsRouter
