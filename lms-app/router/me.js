const path = require('path')
const express = require('express')
const meRoutes = express.Router()

const bcrypt = require('bcryptjs')
const otplib = require('otplib')
const { SALT_ROUNDS, UPLOAD_FOLDER, httpsCerts } = require('../config')
const { v4: uuidv4 } = require('uuid');

const { findUser } = require(LIB_PATH + '/auth')
const { authUser } = require('../middlewares/auth')

const mongo = require(LIB_PATH + '/services/db/mongodb')
const { ObjectID } = require('mongodb')
const multer = require('multer')
const { ref } = require('objection')



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

  .get('/user', async (req, res) => {
    let user = null
    let { email } = req.query
    try {
      user = await mongo.db.collection('user').findOne({ email: email })
      return res.status(200).json(user)
    } catch (e) { }
    return res.status(500).json()
  })

  .get('/stats', authUser, async (req, res) => {
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      const { email } = user
      let rv = await mongo.db.collection('statistics').findOne({ email: email })
      return res.status(200).json(rv)
    } catch (e) { }
    return res.status(500).json()
  })

  .get('/achievements', authUser, async (req, res) => {
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      const { email } = user
      let rv = await mongo.db.collection('achievements').findOne({ email: email })
      return res.status(200).json(rv)
    } catch (e) { }
    return res.status(500).json()
  })

  .get('/reviews', async (req, res) => {
    let { email, pageSize, currentPage } = req.query
    try {

      const total = await mongo.db.collection('reviews').find({ instructor: email }).count()
      const reviews = await mongo.db.collection('reviews').find({ instructor: email }).sort({ "_id": -1 }).skip((Number(currentPage) - 1) * pageSize).limit(Number(pageSize)).toArray()

      for (var review of reviews) {
        const user = await mongo.db.collection('user').findOne({ email: review.author })
        if (user) {
          review['authorImg'] = user.profileImage
        }
      }
      return res.status(200).json({ reviews, total })
    } catch (e) {
      return res.status(400).json({ e })
    }
  })

  .get('/course', authUser, async (req,res) => {
    let { courseRef } = req.query
    try {
      const course = await mongo.db.collection('courses').findOne({ reference: courseRef })
      return res.status(200).json(course)
    }catch(e) {
      return res.status(400).json({ e })
    }
  })

  .get('/courses', async (req, res) => {
    let { email, role } = req.query
    try {
      const total = await mongo.db.collection('courses').find({ createdBy: email }).count()
      const courses = await mongo.db.collection('courses').find({ createdBy: email }).sort({ "_id": -1 }).skip(0).limit(4).toArray()
      return res.status(200).json({ courses, total })
    } catch (e) {
      return res.status(400).json({ e })
    }
  })

  .get('/courses/created', authUser, async (req, res) => {
    try {
      let user = await findUser({ id: req.decoded.id })
      const courses = await mongo.db.collection('courses').find({ createdBy: user.email }).toArray()
      return res.status(200).json({ courses })
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
      const { reference } = req.params
      const r = await mongo.db.collection('courses').findOneAndUpdate({ reference: reference }, { $inc: { views: 1 } })
      res.status(200).json(r.value)
    } catch (e) {
      res.status(404).json({ e: 'Server Error' })
    }
  })

  .post('/addCourse', authUser, async (req, res) => {
    let { title, description, category, level, venue, startDate, duration, objectives, outlines, trainers, attends, fee, regDates, batchID } = req.body
    let user = null
    let course = null
    let regStart = null
    let regEnd = null
    let reference = uuidv4()

    try {
      user = await findUser({ id: req.decoded.id })
      if (user) {
        let first = new Date(regDates[0]).getTime() / 1000
        let second = new Date(regDates[1]).getTime() / 1000
        let endDate = startDate.setDate(date.getDate() + durtion);
        endDate = endDate.toISOString()

        if (first - second < 0) {
          regStart = regDates[0]
          regEnd = regDates[1]
        } else {
          regStart = regDates[1]
          regEnd = regDates[0]
        }

        course = await mongo.db.collection('courses').insertOne({
          reference,
          createdBy: user.email,
          createdOn: new Date().toISOString(),
          batchID,
          title,
          description,
          category,
          level,
          venue,
          startDate,
          duration,
          fee,
          objectives,
          outlines,
          trainers,
          attends,
          views: 0,
          regStart,
          regEnd
        })


        let rv = await mongo.db.collection('classes').insertOne({
          courseRef: reference,
          batchID: batchID,
          duration: duration,
          instructor: user.email,
          startDate: startDate,
          endDate: endDate,
          notice: [],
          quiz: [],
          feedback: []
        })
      }
      return res.status(200).json({ reference })
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/updateCourse', authUser, async (req, res) => {
    let { reference, title, description, category, level, venue, startDate, duration, objectives, outlines, trainers, attends, fee, regDates, batchID, newBatch } = req.body
    let user = null
    let regStart = null
    let regEnd = null

    let first = new Date(regDates[0]).getTime() / 1000
    let second = new Date(regDates[1]).getTime() / 1000

    if (first - second < 0) {
      regStart = regDates[0]
      regEnd = regDates[1]
    } else {
      regStart = regDates[1]
      regEnd = regDates[0]
    }

    try {
      user = await findUser({ id: req.decoded.id })
      let course = await mongo.db.collection('courses').findOne({ reference: reference })
      if (user.email == course.createdBy) {
        if (newBatch) {
          var array = batchID.split('-')
          array[array.length - 1] = Number(array[array.length - 1]) + 1;
          batchID = array.join('-')
        }
        let body = {
          reference,
          batchID: batchID,
          title,
          description,
          category,
          level,
          venue,
          startDate,
          duration,
          fee,
          objectives,
          outlines,
          trainers,
          attends,
          regStart,
          regEnd,

        }

        let rv = await mongo.db.collection('courses').updateOne(
          { reference: reference },
          { $set: body }
        )
        if (rv) {
          return res.status(200).json()
        }
      }
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/survey/create', authUser, async (req, res) => {
    let { reference, survey } = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      if (reference) {
        let rv = mongo.db.collection('survey').insertOne({
          createdBy: user.email,
          createdOn: new Date().toISOString(),
          reference,
          survey,
        })
      }
      return res.status(200).json("Created")
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/survey/update', authUser, async (req, res) => {
    let { reference, survey } = req.body
    let user = null
    let rv = null
    try {
      user = await findUser({ id: req.decoded.id })
      if (reference) {
        rv = mongo.db.collection('survey').updateOne({ reference: reference }, { $set: { survey: survey } })
      }
      return res.status(200).json(rv)
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .get('/survey/:reference', authUser, async (req, res) => {
    try {
      const { reference } = req.params
      const r = await mongo.db.collection('survey').findOne({ reference: reference })
      res.status(200).json(r)
    } catch (e) {
      res.status(404).json({ e: 'Server Error' })
    }
  })

  .get('/survey/results/:reference', authUser, async (req, res) => {
    try {
      const { reference } = req.params
      const r = await mongo.db.collection('surveyResults').find({ reference: reference }).toArray()
      let results = []
      for (var result of r) {
        results.push(result.result)
      }
      res.status(200).json(results)
    } catch (e) {
      res.status(404).json({ e: 'Server Error' })
    }
  })

  .post('/survey/completed', authUser, async (req, res) => {
    let { reference, survey } = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      if (user) {
        let rv = mongo.db.collection('surveyResults').insertOne({
          completedBy: user.email,
          completedOn: new Date().toISOString(),
          reference,
          result: survey,
        })
      }
      return res.status(200).json()
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .get('/browse', authUser, async (req, res) => {
    let { category, date } = req.query
    let courses = null
    try {
      if (category == "Any" && date == "Latest") {
        courses = await mongo.db.collection('courses').find({}).sort({ "_id": -1 }).skip(0).toArray()
      } else if (category == "Any" && date == "Oldest") {
        courses = await mongo.db.collection('courses').find({}).sort({ "_id": 1 }).skip(0).toArray()
      } else if (category != "Any" && date == "Latest") {
        courses = await mongo.db.collection('courses').find({ category: category }).sort({ "_id": -1 }).skip(0).toArray()
      } else if (category != "Any" && date == "Oldest") {
        courses = await mongo.db.collection('courses').find({ category: category }).sort({ "_id": 1 }).skip(0).toArray()
      }
      return res.status(200).json({ courses })
    } catch (e) {
      return res.status(400).json({ e })
    }
  })

  .get('/discussion/list', authUser, async (req, res) => {
    let user = null
    let courses = null
    let regCourses = null
    let template = {
      title: "No post",
      author: ""
    }
    try {
      user = await findUser({ id: req.decoded.id })
      const { email, role } = user
      if (role == "user") {
        let rv = await mongo.db.collection('registration').find({ email: email }, { projection: { reference: "", title: "", _id: 0 } }).toArray()
        for (var i = 0; i < rv.length; i++) {
          let tCount = await mongo.db.collection('threads').find({ courseRef: rv[i].reference }).count()
          let mCount = await mongo.db.collection('messages').find({ courseRef: rv[i].reference }).count()
          rv[i].threads = tCount || 0
          rv[i].msgs = mCount || 0
        }
        return res.status(200).json(rv)
      } else {
        try {
          //created course
          let rv = await mongo.db.collection('courses').find({ createdBy: email }, { projection: { reference: "", title: "", _id: 0 } }).sort({ "_id": -1 }).toArray()
          if (rv.length > 0) {
            for (var i = 0; i < rv.length; i++) {
              let tCount = await mongo.db.collection('threads').find({ courseRef: rv[i].reference }).count()
              let mCount = await mongo.db.collection('messages').find({ courseRef: rv[i].reference }).count()
              let latest = await mongo.db.collection('threads').find({ courseRef: rv[i].reference }).sort({ "_id": -1 }).skip(0).limit(1).toArray()
              rv[i].threads = tCount || 0
              rv[i].msgs = mCount || 0
              rv[i].latest = latest[0] || template
            }
          }
          //registered course
          let rv1 = await mongo.db.collection('registrations').find({ email: email }, { projection: { courserRef: "", title: "", _id: 0 } }).toArray()
          if (rv1.length > 0) {
            for (var i = 0; i < rv.length; i++) {
              let tCount = await mongo.db.collection('threads').find({ courseRef: rv1[i].reference }).count()
              let mCount = await mongo.db.collection('messages').find({ courseRef: rv1[i].reference }).count()
              let latest = await mongo.db.collection('threads').find({ courseRef: rv[i].reference }).sort({ "_id": -1 }).skip(0).limit(1).toArray()
              rv1[i].threads = tCount || 0
              rv1[i].msgs = mCount || 0
              rv1[i].latest = latest[0] || template
            }
          }
          courses = rv
          regCourses = rv1
          return res.status(200).json({ courses, regCourses })
        } catch (e) {
          return res.status(500).json({ e })
        }
      }

    } catch (e) {
      return res.status(500).json({ e })
    }
  })

  .get('/discussion', authUser, async (req, res) => {
    let { reference } = req.query
    let user = null
    let template = {
      title: "No post",
      author: ""
    }
    try {
      let imptThreads = await mongo.db.collection('threads').find({ courseRef: reference, type: "notice" }).sort({ "_id": -1 }).toArray()
      let threads = await mongo.db.collection('threads').find({ courseRef: reference, type: "discussion" }).sort({ "_id": -1 }).toArray()
      for (var i = 0; i < threads.length; i++) {
        let rCount = await mongo.db.collection('messages').find({ tRef: threads[i].reference }).count()
        let latest = await mongo.db.collection('messages').find({ tRef: threads[i].reference }).sort({ "_id": -1 }).skip(0).limit(1).toArray()
        threads[i].rCount = rCount || 0
        threads[i].latest = latest[0] || template
      }
      for (var i = 0; i < imptThreads.length; i++) {
        let rCount = await mongo.db.collection('messages').find({ tRef: imptThreads[i].reference }).count()
        let latest = await mongo.db.collection('messages').find({ tRef: imptThreads[i].reference }).sort({ "_id": -1 }).skip(0).limit(1).toArray()
        imptThreads[i].rCount = rCount || 0
        imptThreads[i].latest = latest[0] || template
      }
      return res.status(200).json({ imptThreads, threads })
    } catch (e) {
      return res.status(500).json({ e })
    }
  })

  .get('/discussion/thread', authUser, async (req, res) => {
    let { tRef } = req.query
    let mainPost = null
    try {
      let thread = await mongo.db.collection('threads').findOneAndUpdate({ reference: tRef }, { $inc: { views: 1 } })
      let posts = await mongo.db.collection('messages').find({ tRef: tRef }).sort({ "_id": 1 }).toArray()

      mainPost = thread.value
      return res.status(200).json({ mainPost, posts })
    } catch (e) {
      return res.status(500).json({ e })
    }
  })

  .post('/discussion/post/thread', authUser, async (req, res) => {
    let { createType, tMsg, title, courseRef } = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      if (user) {
        let body = {
          title: title,
          message: tMsg,
          type: createType,
          author: user.email,
          name: user.name,
          reference: uuidv4(),
          courseRef: courseRef,
          created: new Date().toISOString(),
          views: 0

        }
        let rv = await mongo.db.collection('threads').insertOne(body)
      }
      return res.status(200).json('success')
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/discussion/post/thread/message', authUser, async (req,res) => {
    let { courseRef, tRef, message } = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      if(user) {
        let body = {
          reference: uuidv4(),
          courseRef: courseRef,
          tRef: tRef,
          author: user.email,
          name: user.name,
          created: new Date().toISOString(),
          message: message
        }

        let rv = await mongo.db.collection('messages').insertOne(body)
      }
      return res.status(200).json('success')
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .get('/classes/list', authUser, async (req, res) => {
    let user = null
    let date = new Date().toISOString()
    let classes = null
    let regClasses = null
    try {
      user = await findUser({ id: req.decoded.id })
      const { email, role } = user
      if(role == "user") {

      }else {
        //Own course classes
        let rv = await mongo.db.collection('classes').find({ instructor: email, endDate: {$gte: new Date() } }).toArray()

        //Reg Course classes
        let rv2 = await mongo.db.collection('classes').find({ email: email, endDate: {$gte: new Date() } }).toArray()

        classes =  rv
        regClasses = rv2
        return res.status(200).json({ classes, regClasses })
      }
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .get('/class', authUser, async (req,res) => {
    let { courseRef, batchID } = req.query
    try {
      let rv = await mongo.db.collection('classes').findOne({courseRef: courseRef, batchID: batchID})
      return res.status(200).json(rv)
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/settings/update', authUser, async (req, res) => {
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      if (user) {
        if (req.body.type == "profile") {
          let { name, email, contactNumber, activeTags } = req.body
          let rv = mongo.db.collection('user').findOneAndUpdate({ email: user.email },
            {
              $set:
                { name: name, email: email, contactNumber: contactNumber, activeTags: activeTags }
            })
          return res.status(200).json(rv)
        } else if (req.body.type == "avatar") {
          let { profileImg } = req.body
          let rv = mongo.db.collection('user').findOneAndUpdate({ email: user.email }, { $set: { profileImage: profileImg } })
          return res.status(200).json(rv)
        } else {
          let { oldPassword, password } = req.body
          if ((password && !oldPassword) || (!password && oldPassword)) return res.status(500).json({ e: 'Old and New Password Required' })
          let newPassword
          if (password && oldPassword) {
            if (bcrypt.compareSync(oldPassword, user.password)) {
              newPassword = bcrypt.hashSync(password, SALT_ROUNDS)
            } else {
              return res.status(500).json({ e: 'Invalid Old Password' })
            }
          }
          let rv = mongo.db.collection('user').findOneAndUpdate({ email: user.email }, { $set: { password: newPassword } })
          return res.status(200).json(rv)
        }
      }
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/register', authUser, async (req, res) => {
    let { courseRef, batchID, startDate, endDate } = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      if (user) {
        let body = {
          email: user.email,
          courseRef: courseRef,
          regDate: new Date().toISOString(),
          startDate: ISODate(startDate),
          endDate: ISODate(endDate),
          batchID: batchID
        }
        let rv = await mongo.db.collection('registration').insertOne(body)
      }
      return res.status(200).json('success')
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

module.exports = meRoutes