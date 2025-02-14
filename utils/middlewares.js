const { info, error } = require('./logger')

const unknownEndpoint = (req, res) =>
  res.status(404).send({ error: 'unknown endpoint' })


const errorHandler = (e, req, res, n) => {
  error(e.message)
  if (e.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (e.name === 'MissingContent') {
    return res.status(400).send({ error: 'missing content' })
  }
  if (e.name === 'ValidationError') {
    return res.status(400).send({ error: e.message })
  }
}

module.exports = { unknownEndpoint, errorHandler }

