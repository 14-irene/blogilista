const { info, error } = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('express-async-errors')

const unknownEndpoint = (req, res) =>
  res.status(404).send({ error: 'unknown endpoint' })


const errorHandler = (e, req, res, n) => {
  error(e.message)
  if (e.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (e.name === 'MissingContent') {
    return res.status(400).send({ error: 'missing content' })
  }
  else if (e.name === 'ValidationError') {
    return res.status(400).send({ error: e.message })
  }
  else if (e.name === 'MongoServerError' && e.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  }
  else if (e.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: 'invalid or missing token' })
  }
  n(e)
}

const tokenExtractor = (req, res, n) => {
  const auth = req.get('authorization')
  req.token = auth && auth.startsWith('Bearer ')
    ? auth.replace('Bearer ', '')
    : null
  n() 
}

const userExtractor = async (req, res, n) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    req.user = await User.findById(decodedToken.id)
  }
  n()
}

module.exports = { unknownEndpoint, errorHandler, tokenExtractor, userExtractor }

