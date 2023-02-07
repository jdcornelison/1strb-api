const express = require('express')
const morgan = require('morgan')
const logger = require('node-color-log')
const createError = require('http-errors')

const debug = require('debug')('1strb-api:server')
require('dotenv').config()

const app = express()
const PORT = process.env.SERVER_PORT
const NODE_ENV = process.env.NODE_ENV
  ? process.env.NODE_ENV.trim()
  : 'development'

app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routing
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const membersRouter = require('./routes/members')

app.use('/api/v1', indexRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/members', membersRouter)

// 404 Error Handler
app.use((req, res, next) => {
  next(createError(404))
})

// Generic Error Handler
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = err

  res.status(err.status || 500).json({
    message: 'There was an error processing your request',
    error: `(${err.status}) ${err.message}`
  })
})

app.listen(PORT, () => {
  logger.info(`API server is listening on port ${PORT}...`)
})
