const router = require('express').Router()


module.exports = function (app) {
  app.use('/api',
    router.use('/', require('./api')),
    router.use('/auth', require('./auth')),
    router.use('/me', require('./me')),
    router.use('/schedule', require('./schedule'))
  )
}