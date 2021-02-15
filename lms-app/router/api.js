const express = require('express')
const mongo = require(LIB_PATH + '/services/db/mongodb')
const apiRoutes = express.Router()
const { authSignup, authUser } = require('../middlewares/auth')

const { gcpGetSignedUrl } = require(LIB_PATH + '/services/gcp')

apiRoutes

.get('/healthcheck', async (req, res) => { // health check
  console.log('req.ip', req.ip)
  res.status(200).json({ message: 'FYP-LMS Yr4Sem1 2020' })
})
.get('/health-auth', authUser, async (req, res) => { // health check auth
  res.status(200).json({ message: 'OK LMS AUTH' })
})

.post('/userObj', async (req, res) => {
  try {
    const user = await mongo.db.collection('user').findOne({ email: req.body.email })
    // console.log("333", user.active)
    if (user) { // remove password
      return res.status(200).json({ user })
    }
    return res.status(200).json({ user: null })

  } catch (e) {
    return res.status(500).json({ e: e.toString() })
  }
})

// check email
.post('/signup/email', async (req, res) => {
  try {
    const user = await mongo.db.collection('user').findOne({ email: req.body.email })
    if (user) { // remove password
      return res.status(200).json({ found: true, user })
    }
    return res.status(404).json({ found: false })
  } catch (e) {
    return res.status(500).json({ e: e.toString() })
  }
})

.post('/gcp-sign', authUser, asyncWrapper(gcpGetSignedUrl))

  module.exports = apiRoutes;