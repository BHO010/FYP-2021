const jwt = require('jsonwebtoken')
const { JWT_ALG, JWT_SECRET, jwtCerts } = require('../config')
const { authUser } = require(LIB_PATH + '/auth')

const authSignup = async (req, res, next) => { // only in header
  let token
  try {
    if (req.headers.authorization) {
      if (req.headers.authorization.split(' ')[0] === 'Bearer') token = req.headers.authorization.split(' ')[1]
    }
    if (token) {
      const secretKey = JWT_ALG.substring(0, 2) === 'RS' ? jwtCerts.cert : JWT_SECRET
      let result = jwt.verify(token, secretKey, { algorithm: [JWT_ALG] }) // and options
      if (result) {
        req.decoded = result
        return next()
      }
    }
  } catch (e) {
    console.log('authSignup', e.toString())
    return res.status(500).json({ e: e.toString() })
  }
  return res.status(401).json({ message: 'Error in signup token' })
} 

const authIsAdmin = async (req, res, next) => {
  if (req.decoded.groups === 'admin') next()
  else res.status(401).json({ e: 'Not Allowed' })
}

module.exports = {
  authSignup,
  authUser,
  authIsAdmin
}