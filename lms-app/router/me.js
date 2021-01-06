const path = require('path')
const express = require('express')
const meRoutes = express.Router()

const bcrypt = require('bcryptjs')
const otplib = require('otplib')
const { SALT_ROUNDS, UPLOAD_FOLDER } = require('../config')
const { v4: uuidv4 } = require('uuid');

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

  .get('/courses/created', authUser, async (req, res) => {
    try {
      let user = await findUser({ id: req.decoded.id })
      const courses = await mongo.db.collection('courses').find({createdBy: user.email}).toArray()
        return res.status(200).json({ courses})
    } catch (e) {
      return res.status(400).json({ e: e.toString() })
    }
  })

  .get('/courses/registered', authUser, async (req, res) => {
    try {
      let user = await findUser({ id: req.decoded.id })
      
        return res.status(200).json()
    } catch (e) {
      return res.status(400).json({ e: e.toString() })
    }
  })

  .get('/course/:reference', authUser, async (req, res) => {
    try {
      const {reference} = req.params
      const r = await mongo.db.collection('courses').findOne({reference: reference})
      res.status(200).json(r)
    }catch (e) {
      res.status(404).json({e: 'Server Error'})
    }
  })

  .post('/addCourse', authUser, async (req, res) => {
    let {title, description, category, level, type, venue, time, objectives, outlines, trainers, attends, surveyJson} = req.body
    let user = null
    let course = null
    let reference = uuidv4()
    try {
       user = await findUser({ id: req.decoded.id })
      if(user) {

        course = await mongo.db.collection('courses').insertOne({
          reference,
          createdBy: user.email,
          createdOn: new Date().toISOString(),
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
          attends,
        })
      }
      return res.status(200).json({reference})
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/updateCourse', authUser, async (req, res) => {
    let {reference, title, description, category, level, type, venue, time, objectives, outlines, trainers, attends, surveyJson} = req.body
    let user = null
    try {
       user = await findUser({ id: req.decoded.id })
      if(user) {
        let course = await mongo.db.collection('courses').findOne({reference: reference})
        let body = {
          reference,
          createdBy: course.createdBy,
          createdOn: course.createdOn,
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
          attends,
        }

        let rv = await mongo.db.collection('courses').updateOne(
          {reference: reference}, 
          {$set: body}
        )
        if(rv) {
          return res.status(200).json()
        }
      }
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/survey/create', authUser, async (req, res) => {
    let {reference, surveyJson} = req.body
    let user = null
    surveyJson = surveyJson.replace(/(?:\\[rn])+/g, "")
    let json = JSON.parse(JSON.parse(surveyJson))
    surveyJson = JSON.stringify(json)
    try {
       user = await findUser({ id: req.decoded.id })
      if(reference) {
        let rv = mongo.db.collection('survey').insertOne({
          createdBy: user.email,
          createdOn: new Date().toISOString(),
          reference,
          surveyJson,
        })
      }
      return res.status(200).json()
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .get('/survey/:reference', authUser, async (req, res) => {
    try {
      const {reference} = req.params
      const r = await mongo.db.collection('survey').findOne({reference: reference})
      res.status(200).json(r)
    }catch (e) {
      res.status(404).json({e: 'Server Error'})
    }
  })

  .post('/survey/completed', authUser, async (req, res) => {
    let {reference, data} = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      console.log(reference,data)
      if(user) {
        let rv = mongo.db.collection('surveyResults').insertOne({
          completedBy: user.email,
          completedOn: new Date().toISOString(),
          reference,
          result: data,
        })
      }
      return res.status(200).json()
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })
  module.exports = meRoutes