const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const { userExtractor,
        tokenExtractor, 
        errorHandler, 
        unknownEndpoint } = require('./utils/middlewares')

morgan.token('body', (req) => req.method === 'POST'
  ? JSON.stringify(req.body)
  : ' '
)

mongoose.set('strictQuery', false)

logger.info(`connecting to ${config.MONGODB_URI}`)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('connected to mongoDB'))

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(
`:method :url 
:status :res[content-length] - :response-time ms
:body`, { skip: () => process.env.NODE_ENV === 'test' } ))

app.use(tokenExtractor)
app.use(userExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV='test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(errorHandler)
app.use(unknownEndpoint)

module.exports = app
