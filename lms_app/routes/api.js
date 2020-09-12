const express = require('express')
const mongo = require('mongodb')
const apiRoutes = express.Router()


apiRoutes

.get('/',(req,res) => {
    res.send('We are api')
  })

.get('/post', (req,res) => {
    res.send("we are at post")
})


  module.exports = apiRoutes;