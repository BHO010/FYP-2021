const express = require('express')
const authRoutes = express.Router()

const bcrypt = require('bcryptjs')
const { SALT_ROUNDS } = require('../config')
const { authUser, authSignup } = require('../middlewares/auth')
const { createToken, revokeToken, otp, logout, refresh, login, } = require(LIB_PATH + '/auth')

const mongo = require(LIB_PATH + '/services/db/mongodb')
const { ObjectID } = require('mongodb')

const getUser = async (req, res) => { 
    try {
         const user = await mongo.db.collection('user').findOne({email: 'user'})
         return res.status(200).json({user})
    }catch(e) {
        console.log(e.toString())
    }
  }

const signup = async (req, res) => {
  let errMsg = ''
  try {
    const { email, password,role, name } = req.body
    let encryptedPassword = bcrypt.hashSync(password, SALT_ROUNDS)
    if (role !== 'user' && role !== 'partner') return res.status(500).json({ e: 'invalid role' })
    // if (!email) return res.status(500).json({ e: 'empty email' })

    const rv = await mongo.db.collection('user').insertOne({
      name,
      email,
      password: encryptedPassword,
      role,
      active: true,
      contactNumber: '',
      signupDate: new Date(),
    })

    if (!rv) {
      return res.status(404).json({ e: 'not found' })
    } else {
      return res.status(200).json(rv) // success
    }

  }catch(e) {
    errMsg = e.toString()
  }
  return res.status(500).json({ e: errMsg })
}  



authRoutes
.post('/login', login)
.get('/logout', authUser, logout)
.post('/refresh', authUser, refresh)
.post('/otp', authUser, otp)
.post('/signup', signup)
.get('/users', getUser)



module.exports = authRoutes