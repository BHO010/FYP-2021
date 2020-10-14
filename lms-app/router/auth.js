const express = require('express')
const authRoutes = express.Router()

const bcrypt = require('bcryptjs')
const { SALT_ROUNDS } = require('../config')
const { authUser, authSignup } = require('../middlewares/auth')
const { createToken, revokeToken, otp, logout, refresh, login, } = require(LIB_PATH + '/auth')
const { dateISO, timeISO } = require(LIB_PATH + '/esm/datetime')
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
    const {  name, password,activeTags,role,image } = req.body
    let encryptedPassword = bcrypt.hashSync(password, SALT_ROUNDS)
    let date = new Date()
    if (role !== 'user' && role !== 'instructor') return res.status(500).json({ e: 'invalid role' })
    // if (!email) return res.status(500).json({ e: 'empty email' })

    const body = {
      name,
      password: encryptedPassword,
      activeTags,
      profileImage: image,
      active: true,
      contactNumber: '',
      signupDate: dateISO(new Date()) + " " + timeISO(new Date())
    }

    const rv = await mongo.db.collection('user').findOneAndUpdate(
      { email: req.decoded.id },
      { $set: body },
      { returnNewDocument: true }
    )

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

const signupEmail = async (req, res) => { // get email, verification send code
  const { email, role } = req.body
  //const verificationCode = Number(1048576 + parseInt(Math.random() * 16777215)).toString(36).toUpperCase() // generate verification code
  try {
    const user = await mongo.db.collection('user').findOne({ email })
    const token = await createToken({ id: email }, { expiresIn: '15m' }) // 5 minute expire for signup token
    if (user) {
      await mongo.db.collection('user').updateOne({ email }, { $set: { verificationCode } })
      return res.status(200).json({ token, user })
    } else {
      await mongo.db.collection('user').insertOne({
        email,
        //verificationCode,
        role,
      })

      return res.status(201).json({ token, user: null })
    }
  } catch (e) {
    return res.status(500).json({ e: e.toString() })
  }
}




authRoutes
.post('/login', login)
.get('/logout', authUser, logout)
.post('/refresh', authUser, refresh)
.post('/otp', authUser, otp)
.post('/signup', authSignup, signup)
.post('/signup-email', signupEmail)
.get('/users', getUser)



module.exports = authRoutes