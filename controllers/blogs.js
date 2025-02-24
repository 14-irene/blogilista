const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
require('express-async-errors')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs).end()
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog({
    ...request.body, 
    user: '67b2fb56d22fccf13bc35556' //id of root 
  })
  const res = await blog.save()
  response.status(201).json(res).end()
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const newBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.status(200).json(newBlog).end()
})

module.exports = blogsRouter
