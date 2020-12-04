const path = require('path')
const express = require('express')
const meRoutes = express.Router()

const bcrypt = require('bcryptjs')
const otplib = require('otplib')
const { SALT_ROUNDS, UPLOAD_FOLDER } = require('../config')

const { findUser } = require(LIB_PATH + '/auth')
const { authUser } = require('../middlewares/auth')

const mongo = require(LIB_PATH + '/services/db/mongodb')
const { ObjectID } = require('mongodb')
const multer = require('multer')



meRoutes
  // get user
  .get('/', authUser, async (req, res) => {
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      const { password, ...rv } = user
      return res.status(200).json(rv)
    } catch (e) { }
    return res.status(500).json()
  })

  .get('/reviews', async (req, res) => {
    let {email, pageSize, currentPage } = req.query
    try {
      
      const total = await mongo.db.collection('reviews').find({instructor: email}).count()
      const  reviews  = await mongo.db.collection('reviews').find({instructor: email}).sort({"_id": -1}).skip( (Number(currentPage)-1) * pageSize).limit(Number(pageSize)).toArray()

      for(var review of reviews) {
        const user = await mongo.db.collection('user').findOne({email: review.author})
        if(user) {
          review['authorImg'] = user.profileImage
        }
      }
        return res.status(200).json({ reviews,total })
    } catch (e) {
      return res.status(400).json({e})
    }
  })

  .get('/courses', async (req, res) => {
    let {email, role } = req.query
    try {
      const total = await mongo.db.collection('courses').find({createdBy: email}).count()
      const courses = await mongo.db.collection('courses').find({createdBy: email}).sort({"_id": -1}).skip(0).limit(4).toArray()
        return res.status(200).json({ courses,total })
    } catch (e) {
      return res.status(400).json({e})
    }
  })

  .post('/addCourse', authUser, async (req, res) => {
    let {title, description, category, level, type, venue, time, objectives, outlines, trainers, attends} = req.body
    let user = null
    try {
       user = await findUser({ id: req.decoded.id })
      if(user) {
        const course = await mongo.db.collection('courses').insertOne({
          createdBy: user.email,
          title, 
          description, 
          category,
          level,
          type,
          venue, 
          time, 
          objectives, 
          outlines, 
          trainers, 
          attends
        })
      }
      return res.status(200).json()
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  module.exports = meRoutes