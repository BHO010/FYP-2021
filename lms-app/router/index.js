const router = require('express').Router()


module.exports = function (app) {
  app.use('/api',
    router.use('/', require('./api')),
    router.use('/auth', require('./auth')),
    router.use('/me', require('./me')),
    router.use('/admin', require('./admin')),
    router.use('/admin/user', require('./user')),
    router.use('/schedule', require('./schedule'))
  )
}