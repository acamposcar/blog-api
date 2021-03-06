require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')
const connectDB = require('./config/db')
const indexRouter = require('./routes/index')
const postRouter = require('./routes/post')
const usersRouter = require('./routes/users')
const commentRouter = require('./routes/comment')
const helmet = require('helmet')
const compression = require('compression')

const app = express()

connectDB()

app.use(helmet({
  // Without setting this, avatar preview throws an error
  contentSecurityPolicy: false
}))

app.use(compression())

// Passport configuration
require('./config/passport')
app.use(passport.initialize())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'client/build')))
app.use(express.static(path.join(__dirname, 'client/dashboard')))

app.use('/api', indexRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/comments', commentRouter)
// Redirect to react for any unknown path

app.use('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dashboard', 'index.html'))
})

app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({
    message: 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
})

module.exports = app
