const express = require('express')
const authRoutes = express.Router()

const bcrypt = require('bcryptjs')
const { SALT_ROUNDS } = require('../config')
const { authUser, authSignup } = require('../middlewares/auth')
const { createToken, revokeToken, otp, logout, refresh, login, } = require(LIB_PATH + '/auth')

const mongo = require(LIB_PATH + '/services/db/mongodb')

const getUser = async (req, res) => { 
    try {
         const user = await mongo.db.collection('user').findOne({email: 'user'})
         return res.status(200).json({user})
    }catch(e) {
        console.log(e.toString())
    }
  }



authRoutes
.post('/login', login)
.get('/logout', authUser, logout)
.post('/refresh', authUser, refresh)
.post('/otp', authUser, otp)

.get('/users', getUser)



module.exports = authRoutes