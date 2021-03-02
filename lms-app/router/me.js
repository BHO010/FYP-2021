const path = require('path')
const express = require('express')
const meRoutes = express.Router()

const bcrypt = require('bcryptjs')
const otplib = require('otplib')
const { SALT_ROUNDS, UPLOAD_FOLDER, httpsCerts, MONGO_DB } = require('../config')
const { v4: uuidv4 } = require('uuid');

const { findUser } = require(LIB_PATH + '/auth')
const { authUser } = require('../middlewares/auth')
const { sendGrid } = require(LIB_PATH + '/comms/email')

const mongo = require(LIB_PATH + '/services/db/mongodb')
const { ObjectID } = require('mongodb')
const multer = require('multer')


const getQuizResult = async (req, res) => {  //check if user done the quiz
  let { courseRef, batchID, quizID } = req.query
  let user = null
  try {
    user = await findUser({ id: req.decoded.id })
    let rv = await mongo.db.collection('quizResults').findOne({ courseRef: courseRef, batchID, batchID, quizID: quizID, completedBy: user.email })

    if (rv) {
      return res.status(200).json({ found: true })
    } else {
      return res.status(200).json({ found: false })
    }
  } catch (e) {
    return res.status(500).json({ e: e.toString() })
  }
}


meRoutes
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
    let { email, type } = req.query
    let found = false
    try {
      if(type == "forgotPW") {
        user = await mongo.db.collection('user').findOne({ email: email, active: true })
        if(user) {
          found = true
        }
        return res.status(200).json({found})
      }else {
        user = await mongo.db.collection('user').findOne({ email: email})
        return res.status(200).json(user)
      }
    
    } catch (e) { }
    return res.status(500).json()
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

  .get('/stats', authUser, async (req, res) => {
    let user = null
    let courses = null
    try {
      user = await findUser({ id: req.decoded.id })
      const { email, role } = user


      let stats = await mongo.db.collection('statistics').findOne({ email: email })

      if (role == "instructor") {
        courses = await mongo.db.collection('courses').find({ createdBy: email }, { projection: { registration: 1, title: 1, _id: 1 } }).toArray()

        let courseList = ["All"]
        let aggregate = []


        for (var course of courses) {
          for (var item of course.registration) {
            let template = {
              year: "",
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
            index = aggregate.findIndex(
              (p) => p.year == item.year
            )
            if (index < 0) {
              template.year = item.year
              aggregate.push(template)
              index = 0
            }
            for (var [i, month] of item.data.entries()) {
              aggregate[index].data[i] += month
            }
          }
          courseList.push(course.title)
        }
        return res.status(200).json({ stats, courses, aggregate, courseList }) //success
      } else {
        return res.status(200).json({ stats }) //success
      }
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .get('/achievements', authUser, async (req, res) => {
    let user = null
    let { type } = req.query
    try {
      user = await findUser({ id: req.decoded.id })
      const { email } = user

      if (type == "profile") {
        let rv = await mongo.db.collection('achievements').findOne({ email: email })
        let achieve = []

        for (var item of rv.achievements) {
          if (item.level > 0) {
            achieve.push(item)
          }
        }
        return res.status(200).json(achieve)
      } else {
        let rv = await mongo.db.collection('achievements').findOne({ email: email })
        return res.status(200).json(rv.achievements)
      }

    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/achievement/stats', authUser, async (req, res) => {
    let user = null
    let rv = null
    try {
      user = await findUser({ id: req.decoded.id })
      let rv0 = await mongo.db.collection('achievements').findOne({ email: user.email })
      let stats = await mongo.db.collection('statistics').findOne({ email: user.email })
      let update = false
      for (var achievement of rv0.achievements) {
        let points = stats[achievement.id]
        if (achievement.nextReq < points) {
          achievement.level++
          achievement.nextReq += achievement.level * achievement.multiplier
          update = true
        }
      }

      if (update) {
        rv = await mongo.db.collection('achievements').findOneAndUpdate({ email: user.email, "achievements.id": achievement.id }, {
          $set: {
            achievements: rv0.achievements
          }
        },
          { returnNewDocument: true })
      } else {
        rv = await mongo.db.collection('achievements').findOne({ email: user.email })
      }

      return res.status(200).json(rv)
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
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

  .post('/register', authUser, async (req, res) => {
    let { title, courseRef, batchID, startDate, endDate, instructor } = req.body
    let user = null
    let year = new Date().getFullYear()
    let month = new Date().getMonth()
    try {
      user = await findUser({ id: req.decoded.id })
      let register = await mongo.db.collection('registrations').findOne({ email: user.email, courseRef: courseRef, batchID: batchID }) //check if user register b4
      let userStats = await mongo.db.collection('statistics').findOne({ email: user.email })
      //let userAchieve = await mongo.db.collection('achievements').findOne({ email: user.email })
      //let instructorAchieve = await mongo.db.collection('achievements').findOne({ email: instructor })
      let course = await mongo.db.collection('courses').findOne({ createdBy: instructor, reference: courseRef })

      if (register) {
        return res.status(200).json({ success: false, msg: 'You have already registered for the course!' })
      }

      if (user && user.email == instructor) {
        return res.status(200).json({ success: false, msg: 'Cannot Register for your own course!' })
      } else {
        let body = {
          email: user.email,
          name: user.name,
          active: true,
          endAlert: false,
          courseRef: courseRef,
          title: title,
          regDate: new Date(),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          batchID: batchID
        }

        //Transaction
        const { defaultTransactionOptions, client } = mongo
        const session = client.startSession({ defaultTransactionOptions }) // for transactions
        session.startTransaction()
        try {
          let rv0 = await mongo.db.collection('registrations').insertOne(body, { session })
          let rv1 = await mongo.db.collection('statistics').findOneAndUpdate({ email: user.email }, { $inc: { registered: 1 } }, { session })  //update user
          let rv2 = await mongo.db.collection('statistics').findOneAndUpdate({ email: instructor }, { $inc: { studentsCount: 1 } }, { session }) //update instructor

          var index = userStats.registration.findIndex(p => p.year == year)  //add user registration
          var index2 = course.registration.findIndex(p => p.year == year)  // add course registration stats
          //user
          if (index < 0) {
            let template = {
              year: year,
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }

            template.data[month]++
            userStats.registration.push(template)
            await mongo.db.collection('statistics').updateOne({ email: user.email }, {
              $set: {
                registration: userStats.registration
              }
            },
              { session })
          } else {
            userStats.registration[index].data[month]++
            await mongo.db.collection('statistics').updateOne({ email: user.email }, {
              $set: {
                registration: userStats.registration
              }
            },
              { session })
          }

          //course 
          if (index2 < 0) {
            let template = {
              year: year,
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }

            template.data[month]++
            course.registration.push(template)
            await mongo.db.collection('courses').updateOne({ createdBy: instructor, reference: courseRef }, {
              $set: {
                registration: course.registration
              }
            },
              { session })
          } else {
            course.registration[index2].data[month]++
            await mongo.db.collection('courses').updateOne({ createdBy: instructor, reference: courseRef }, {
              $set: {
                registration: course.registration
              }
            },
              { session })
          }

          await session.commitTransaction()
          return res.status(200).json({ success: true, msg: 'Registered Successfully!' }) //success
        } catch (e) {
          await session.abortTransaction()
          res.status(500).json({ e: e.toString() })

        }
        return session.endSession()
      }
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .get('/register/count', authUser, async (req, res) => {
    let {courseRef, batchID} = req.query
    let count = 0
    try {
      let rv = await mongo.db.collection('registrations').find({courseRef: courseRef, batchID: batchID}).count()
      if(rv) {
        count = rv
      }
      return res.status(200).json({count})
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/level-update', authUser, async (req, res) => {
    let { level } = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      await mongo.db.collection('user').updateOne({ email: user.email }, {
        $set: {
          level: level
        }
      })
      return res.status(200).json("success")
    } catch (e) {
      return res.status(400).json({ e })
    }
  })

  .get('/review', authUser, async (req, res) => {
    let { reference } = req.query
    try {
      let rv = await mongo.db.collection('survey').findOne({ reference: reference, type: "review" })
      return res.status(200).json(rv)
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/review/completed', authUser, async (req,res) => {
    let {reference, review, notificationIndex, courseRef} = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      //Transaction
      const { defaultTransactionOptions, client } = mongo
      const session = client.startSession({ defaultTransactionOptions }) // for transactions
      session.startTransaction()
      try {
        let instructorRating = review[1].rating
        let courseRating = review[2].rating


        await mongo.db.collection('statistics').updateOne({email: reference}, {
          $inc: {
            rateCount: 1,
            totalRate: instructorRating,
            reviewsCount: 1
          } 
        }, {session})

        await mongo.db.collection('courses').updateOne({reference: courseRef}, {
          $inc: {
            totalRate: courseRating,
            rateCount: 1
          }
        }, {session})

        user.notifications.splice(notificationIndex,1)

        await mongo.db.collection('user').updateOne({email: user.email}, {
          $set: {
            notifications: user.notifications
          }
        }, {session})

        await mongo.db.collection('reviews').insertOne({
          author: user.email,
          name: user.name,
          joined: user.signupDate,
          date: new Date(),
          instructor: reference,
          review:  review[0].answer
        }, {session})

        await session.commitTransaction()
        return res.status(200).json({ success: true, msg: 'Review Completed Successfully!' }) //success
      }catch(e) {
        await session.abortTransaction()
        res.status(500).json({ e: e.toString() })
      }
      return session.endSession() 
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/generate-code', authUser, async (req, res) => {
    let { email } = req.body
    const confirmationCode = Number(1048576 + parseInt(Math.random() * 16777215)).toString(36).toUpperCase();
    try {
      await mongo.db.collection('user').updateOne({email: email}, {
        $set: {
          pwCode: confirmationCode
        }
      })
      
      const emailGreeting = "Dear NTU-LMS Customer,"
      const emailText1 = `Your have  requested to change your password. Your verification code is ${confirmationCode}.`
      const emailText2 = "Please update your profile and change your password once you log in."
      const emailText3 = "For further support, email admin@ntu.edu.sg."
      const emailClosing1 = "Sincerely,"
      const emailClosing2 = "The NTU-LMS team"
      //await sendGrid(email, '', 'Account Created', emailGreeting + "\n\n" + emailText1 + "\n\n" + emailText2 + "\n\n" + emailText3 + "\n\n" + emailClosing1 + "\n" + emailClosing2)
      console.log(email, '', 'Account Created', emailGreeting + "\n\n" + emailText1 + "\n\n" + emailText2 + "\n\n" + emailText3 + "\n\n" + emailClosing1 + "\n" + emailClosing2)
            
      return res.status(200).json({msg: "Please check your email for your verification code."})
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/verifyCode', authUser, async (req, res) => {
    try {
      const {email, code } = req.body
      const rv = await mongo.db.collection('user').findOne({ email: email, pwCode: code })
      if (!rv) {
        return res.status(404).json({ e: 'not found' })
      } else {
        return res.status(201).json({ msg: "Success" })
      }
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/updatePW', authUser, async (req, res) => {
    let {password, email} = req.body
    let encryptedPassword = bcrypt.hashSync(password, SALT_ROUNDS)
    try {
      let rv = await mongo.db.collection('user').findOneAndUpdate({email: email}, {
        $set: {
          password: encryptedPassword
        }
      })
      if(rv) {
        return res.status(201).json({ msg: "Password changed successfully!" })
      }
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })





  // Course related API

  .get('/course', authUser, async (req, res) => {
    let { courseRef } = req.query
    try {
      const course = await mongo.db.collection('courses').findOne({ reference: courseRef })
      return res.status(200).json(course)
    } catch (e) {
      return res.status(400).json({ e })
    }
  })

  .get('/course/recommended', authUser, async (req,res) => {
    try{ 
      let rv = await mongo.db.collection('courses').aggregate([
        {$match: {}
        },
        { 
            $project: { 
                    rating: { 
                             $cond: [ { $eq: ["$rateCount", 0] }, 0, { $divide: ["$totalRate", "$rateCount"]} ]
                     },
                     reference: 1,
                     title: 1,
                     level: 1,

            }
        },
        {$sort: {rating: -1}},
        { $limit : 4 }
    ]).toArray()

      return res.status(200).json(rv)
    }catch(e) {
      return res.status(400).json({ e: e.toString() })
    }
  })

  .get('/courses', authUser, async (req, res) => {
    let total = null
    let courses = null
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })

      if (user.role == "instructor") {
        //const total = await mongo.db.collection('courses').find({ createdBy: email }).count()
        courses = await mongo.db.collection('courses').find({ createdBy: user.email }).sort({ "_id": -1 }).skip(0).limit(4).toArray()
      } else {
        courses = await mongo.db.collection('registrations').find({ email: user.email }).sort({ "_id": -1 }).skip(0).limit(4).toArray()
      }

      return res.status(200).json({ courses })
    } catch (e) {
      return res.status(400).json({ e })
    }
  })

  .get('/courses/list', authUser, async (req, res) => {
    try {
      let list = []
      let user = await findUser({ id: req.decoded.id })
      let courses = await mongo.db.collection('courses').find({ createdBy: user.email }).toArray()

      for (var item of courses) {
        list.push(item.title)
      }

      return res.status(200).json({ list, courses })
    } catch (e) {
      return res.status(400).json({ e: e.toString() })
    }
  })

  .get('/courses/students', authUser, async (req, res) => {
    let { courseRef, batchID } = req.query
    try {
      let user = await findUser({ id: req.decoded.id })
      let rv = await mongo.db.collection('registrations').find({ courseRef: courseRef, batchID: batchID }).toArray()

      return res.status(200).json(rv)
    } catch (e) {
      return res.status(400).json({ e: e.toString() })
    }
  })

  .delete('/courses/students', authUser, async (req, res) => {
    let { courseRef, batchID, email } = req.query
    let year = new Date().getFullYear()
    let month = new Date().getMonth()
    try {
      let instructor = await findUser({ id: req.decoded.id }) // this is instructor
      let course = await mongo.db.collection('courses').findOne({ createdBy: instructor.email, reference: courseRef }) // get course
      let userStats = await mongo.db.collection('statistics').findOne({ email: email }) //students stats

      //Transaction
      const { defaultTransactionOptions, client } = mongo
      const session = client.startSession({ defaultTransactionOptions }) // for transactions
      session.startTransaction()
      try {
        let rv = await mongo.db.collection('registrations').deleteOne({ courseRef: courseRef, batchID: batchID, email: email }, { session })
        let rv1 = await mongo.db.collection('statistics').findOneAndUpdate({ email: email }, { $inc: { registered: -1 } }, { session })  //update user
        let rv2 = await mongo.db.collection('statistics').findOneAndUpdate({ email: instructor.email }, { $inc: { studentsCount: -1 } }, { session }) //update instructor

        //update user and course stats
        var index = userStats.registration.findIndex(p => p.year == year)  //add user registration
        var index2 = course.registration.findIndex(p => p.year == year)  // add course registration stats

        //user
        userStats.registration[index].data[month]--
        await mongo.db.collection('statistics').updateOne({ email: email }, {
          $set: {
            registration: userStats.registration
          }
        },
          { session })

        //course
        course.registration[index2].data[month]--
        await mongo.db.collection('courses').updateOne({ createdBy: instructor.email, reference: courseRef }, {
          $set: {
            registration: course.registration
          }
        },
          { session })

        await session.commitTransaction()
        return res.status(200).json({ success: true, msg: 'Deleted Successfully!' }) //success

      } catch (e) {
        await session.abortTransaction()
        res.status(500).json({ e: e.toString() })
      }
      return session.endSession()
    } catch (e) {
      return res.status(400).json({ e: e.toString() })
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
      let rv = await mongo.db.collection('registrations').find({ email: user.email }).toArray()

      return res.status(200).json(rv)
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
        let date = new Date(startDate)
        let endDate = date.setDate(date.getDate() + duration);
        endDate = new Date(endDate)
        endDate = endDate.toISOString()

        if (first - second < 0) {
          regStart = regDates[0]
          regEnd = regDates[1]
        } else {
          regStart = regDates[1]
          regEnd = regDates[0]
        }

        //Transaction
        const { defaultTransactionOptions, client } = mongo
        const session = client.startSession({ defaultTransactionOptions }) // for transactions
        session.startTransaction()
        try {
          course = await mongo.db.collection('courses').insertOne({
            reference,
            active: true,
            createdBy: user.email,
            createdOn: new Date().toISOString(),
            batchID,
            title,
            description,
            category,
            level,
            venue,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            duration,
            fee,
            objectives,
            outlines,
            trainers,
            attends,
            views: 0,
            regStart,
            regEnd,
            totalRate: 0,
            rateCount: 0,
            registration: []
          }, { session })

          let rv = await mongo.db.collection('classes').insertOne({
            courseRef: reference,
            batchID: batchID,
            duration: duration,
            instructor: user.email,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            notice: [],
            quiz: [],
            feedback: []
          }, { session })

          await mongo.db.collection('statistics').updateOne({ email: user.email }, { $inc: { courseCreated: 1 } }, { session })
          await mongo.db.collection('user').updateOne({ email: user.email }, { $inc: { knowledgePoints: 50 } }, { session })


          await session.commitTransaction()
          return res.status(200).json({ reference })

        } catch (e) {
          await session.abortTransaction()
          res.status(500).json({ e: e.toString() })
        }
        return session.endSession()
      }

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

  //Survey Related API

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

  .get('/survey/:reference', authUser, async (req, res) => {  //find survey question
    try {
      const { reference } = req.params
      const r = await mongo.db.collection('survey').findOne({ reference: reference })
      res.status(200).json(r)
    } catch (e) {
      res.status(404).json({ e: 'Server Error' })
    }
  })

  .get('/survey/results/:reference', authUser, async (req, res) => {  //find survey replies
    try {
      const { reference } = req.params

      const survey = await mongo.db.collection('survey').findOne({ reference: reference }, { projection: { survey: 1, _id: 0 } })
      const r = await mongo.db.collection('surveyResults').find({ reference: reference }, { projection: { result: 1, _id: 0 } }).toArray()

      let aggregate = []
      //set up aggregate array
      if (survey) {

        for (var [index, q] of survey.survey.entries()) {
          let template = {
            id: null,
            type: "",
            title: "",
            categories: [],
            data: []
          }

          if (aggregate[index] == null) {
            template.id = q.id
            template.title = q.title
            template.type = q.type
            if (q.type == "check" || q.type == "radio") {
              for (var option of q.options) {
                //console.log("AA",option.title)
                template.categories.push(option.title)
              }
            }
            aggregate.push(template)
          }
        }
      }


      //console.log("SETUP", aggregate)

      //aggregate result into aggregate array
      if (r) {
        for (var d of r) {
          for (var index2 of d.result) {
            for (var i of aggregate) {
              if (i.id == index2.id) {
                if (i.type == 'text') {
                  if (index2.answer != null) {
                    i.data.push(index2.answer)
                  }
                } else if (i.type == 'rate') {
                  i.data.push(index2.rating)
                } else if (i.type == 'check') {
                  for (var x of index2.selected) {
                    if (i.data[x] == null) {
                      i.data[x] = 1
                    } else {
                      i.data[x]++
                    }
                  }
                } else if (i.type == 'radio') {
                  if (i.data[index2.selected] == null) {
                    console.log("HH", index2.selected)
                    i.data[index2.selected] = 1
                  } else {
                    i.data[index2.selected]++
                  }

                }

              }
            }
          }
        }
      }


      res.status(200).json(aggregate)
    } catch (e) {
      res.status(404).json({ e: 'Server Error' })
    }
  })

  .post('/survey/completed', authUser, async (req, res) => {
    let { reference, survey } = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      //Transaction
      const { defaultTransactionOptions, client } = mongo
      const session = client.startSession({ defaultTransactionOptions }) // for transactions
      session.startTransaction()
      try {
        if (user) {
          let rv = await mongo.db.collection('surveyResults').insertOne({
            completedBy: user.email,
            completedOn: new Date().toISOString(),
            reference,
            result: survey,
          }, { session })

          var index = user.notifications.findIndex(p => p.reference == reference)
          user.notifications.splice(index, 1)

          await mongo.db.collection('user').updateOne({ email: user.email }, {
            $set: {
              notifications: user.notifications
            }
          }, { session })

          await session.commitTransaction()
          return res.status(200).json({ success: true, msg: 'Survey Completed Successfully!' }) //success

        }
      } catch (e) {
        await session.abortTransaction()
        res.status(500).json({ e: e.toString() })
      }
      return session.endSession()
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })


  //Discussion Board related API

  .get('/discussion/list', authUser, async (req, res) => {
    let user = null
    let courses = null
    let regCourses = null
    let template = {
      title: "No post",
      author: ""
    }
    let {currentPage, pageSize} = req.query
    try {
      user = await findUser({ id: req.decoded.id })
      const { email, role } = user
      if (role == "user") {
        let rv = await mongo.db.collection('registrations').find({ email: email }, { projection: { courseRef: "", title: "", _id: 1 } }).skip((Number(currentPage) - 1) * pageSize).limit(Number(pageSize)).toArray()
        let total = Math.ceil(await mongo.db.collection('registrations').find({ email: email }, { projection: { courseRef: "", title: "", _id: 1 } }).count() /pageSize )
        for (var i = 0; i < rv.length; i++) {
          let tCount = await mongo.db.collection('threads').find({ courseRef: rv[i].courseRef }).count()
          let mCount = await mongo.db.collection('messages').find({ courseRef: rv[i].courseRef }).count()
          let latest = await mongo.db.collection('threads').find({ courseRef: rv[i].courserRef }).sort({ "_id": -1 }).skip(0).limit(1).toArray()
          rv[i].threads = tCount || 0
          rv[i].msgs = mCount || 0
          rv[i].latest = latest[0] || template
        }
        return res.status(200).json({rv, total})
      } else {
        try {
          //created course
          let rv = await mongo.db.collection('courses').find({ createdBy: email }, { projection: { reference: "", title: "", _id: 1 } }).sort({ "_id": -1 }).skip((Number(currentPage) - 1) * pageSize).limit(Number(pageSize)).toArray()
          let totalCourse = Math.ceil( await mongo.db.collection('courses').find({ createdBy: email }, { projection: { reference: "", title: "", _id: 1 } }).count() /4)
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
          let rv1 = await mongo.db.collection('registrations').find({ email: email }, { projection: { courserRef: "", title: "", _id: 1 } }).skip((Number(currentPage) - 1) * pageSize).limit(Number(pageSize)).toArray()
          let totalRegCourse = Math.ceil( await mongo.db.collection('registrations').find({ email: email }, { projection: { courserRef: "", title: "", _id: 1 } }).count() /4 )
          if (rv1.length > 0) {
            for (var i = 0; i < rv.length; i++) {
              let tCount = await mongo.db.collection('threads').find({ courseRef: rv1[i].courserRef }).count()
              let mCount = await mongo.db.collection('messages').find({ courseRef: rv1[i].courserRef }).count()
              let latest = await mongo.db.collection('threads').find({ courseRef: rv1[i].courserRef }).sort({ "_id": -1 }).skip(0).limit(1).toArray()
              rv1[i].threads = tCount || 0
              rv1[i].msgs = mCount || 0
              rv1[i].latest = latest[0] || template
            }
          }
          courses = rv
          regCourses = rv1
          return res.status(200).json({ courses, totalCourse, regCourses, totalRegCourse })
        } catch (e) {
          return res.status(500).json({ e })
        }
      }

    } catch (e) {
      return res.status(500).json({ e })
    }
  })

  .get('/discussion/list/update', authUser, async (req, res) => {
    let {currentPage, type} = req.query
    let user = null
    let pageSize = 4
    let template = {
      title: "No post",
      author: ""
    }
    try {
      user = await findUser({ id: req.decoded.id })
      if(user.role == "user") {
        let rv = await mongo.db.collection('registrations').find({ email: user.email }, { projection: { courseRef: "", title: "", _id: 1 } }).skip((Number(currentPage) - 1) * pageSize).limit(Number(pageSize)).toArray()
        for (var i = 0; i < rv.length; i++) {
          let tCount = await mongo.db.collection('threads').find({ courseRef: rv[i].courseRef }).count()
          let mCount = await mongo.db.collection('messages').find({ courseRef: rv[i].courseRef }).count()
          let latest = await mongo.db.collection('threads').find({ courseRef: rv[i].courserRef }).sort({ "_id": -1 }).skip(0).limit(1).toArray()
          rv[i].threads = tCount || 0
          rv[i].msgs = mCount || 0
          rv[i].latest = latest[0] || template
        }
        
        return res.status(200).json(rv)
      }else {
        if(type == "registered") {
          let rv = await mongo.db.collection('registrations').find({ email: user.email }, { projection: { courserRef: "", title: "", _id: 1 } }).skip((Number(currentPage) - 1) * pageSize).limit(Number(pageSize)).toArray()
          
          if (rv.length > 0) {
            for (var i = 0; i < rv.length; i++) {
              let tCount = await mongo.db.collection('threads').find({ courseRef: rv[i].courserRef }).count()
              let mCount = await mongo.db.collection('messages').find({ courseRef: rv[i].courserRef }).count()
              let latest = await mongo.db.collection('threads').find({ courseRef: rv[i].courserRef }).sort({ "_id": -1 }).skip(0).limit(1).toArray()
              rv[i].threads = tCount || 0
              rv[i].msgs = mCount || 0
              rv[i].latest = latest[0] || template
            }
          }
          return res.status(200).json(rv)
        }else {
          let rv = await mongo.db.collection('courses').find({ createdBy: user.email }, { projection: { reference: "", title: "", _id: 1 } }).sort({ "_id": -1 }).skip((Number(currentPage) - 1) * pageSize).limit(Number(pageSize)).toArray()
          
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
          return res.status(200).json(rv)
        }
      }
    }catch(e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .get('/discussion', authUser, async (req, res) => {
    let { type, reference, currentPage } = req.query
    let user = null
    let pageSize = 4
    let template = {
      name: "No post",
      created: ""
    }
    try {

      if (type == "imptThreads") {
        let imptThreadsCount = await mongo.db.collection('threads').find({ courseRef: reference, type: "notice" }).count()
        let imptThreads = await mongo.db.collection('threads').find({ courseRef: reference, type: "notice" }).sort({ "_id": 1 }).skip((Number(currentPage) - 1) * pageSize).limit(Number(pageSize)).toArray()

        for (var i = 0; i < imptThreads.length; i++) {
          let rCount = await mongo.db.collection('messages').find({ tRef: imptThreads[i].reference }).count()
          let latest = await mongo.db.collection('messages').find({ tRef: imptThreads[i].reference }).sort({ "_id": -1 }).skip(0).limit(1).toArray()
          imptThreads[i].rCount = rCount || 0
          imptThreads[i].latest = latest[0] || template
        }
        return res.status(200).json({ imptThreads, imptThreadsCount })
      } else {
        let threadsCount = await mongo.db.collection('threads').find({ courseRef: reference, type: "discussion" }).count()
        let threads = await mongo.db.collection('threads').find({ courseRef: reference, type: "discussion" }).sort({ "_id": 1 }).skip((Number(currentPage) - 1) * pageSize).limit(Number(pageSize)).toArray()
        for (var i = 0; i < threads.length; i++) {
          let rCount = await mongo.db.collection('messages').find({ tRef: threads[i].reference }).count()
          let latest = await mongo.db.collection('messages').find({ tRef: threads[i].reference }).sort({ "_id": -1 }).skip(0).limit(1).toArray()
          threads[i].rCount = rCount || 0
          threads[i].latest = latest[0] || template
        }

        return res.status(200).json({ threads, threadsCount })
      }
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
          views: 0,
          upvote: [],
          downvote: []

        }
        let rv = await mongo.db.collection('threads').insertOne(body)
        await mongo.db.collection('statistics').findOneAndUpdate({ email: user.email }, { $inc: { discussionPoints: 5 } })
        await mongo.db.collection('user').findOneAndUpdate({ email: user.email }, { $inc: { knowledgePoints: 5 } })
      }
      return res.status(200).json('success')
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/discussion/post/thread/message', authUser, async (req, res) => {
    let { courseRef, tRef, message } = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      if (user) {
        let body = {
          reference: uuidv4(),
          courseRef: courseRef,
          tRef: tRef,
          author: user.email,
          name: user.name,
          created: new Date().toISOString(),
          message: message,
          upvote: [],
          downvote: []
        }

        let rv = await mongo.db.collection('messages').insertOne(body)
        //update stats
        await mongo.db.collection('statistics').findOneAndUpdate({ email: user.email }, { $inc: { discussionPoints: 1 } })
        await mongo.db.collection('user').findOneAndUpdate({ email: user.email }, { $inc: { knowledgePoints: 1 } })
      }
      return res.status(200).json('success')
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/discussion/vote', authUser, async (req, res) => {
    let { reference, type, vote } = req.body
    try {
      let user = await findUser({ id: req.decoded.id })
      let rv = null
      let rv0 = null

      //get documents
      if (type == "message") {
        rv = await mongo.db.collection('messages').findOne({ reference: reference }, { projection: { upvote: 1, downvote: 1, author: 1 } })
      } else {
        rv = await mongo.db.collection('threads').findOne({ reference: reference }, { projection: { upvote: 1, downvote: 1, author: 1 } })
      }

      //Transaction
      const { defaultTransactionOptions, client } = mongo
      const session = client.startSession({ defaultTransactionOptions }) // for transactions
      session.startTransaction()
      try {

        //update votes
        if (vote == "upvote") {
          if (rv.downvote.includes(user.name)) { //remove from downvote
            var index = rv.downvote.findIndex(p => p == user.name)
            rv.downvote.splice(index, 1)
            rv.upvote.push(user.name)

            //update author stats
            await mongo.db.collection('statistics').updateOne({ email: rv.author }, { $inc: { discussionPoints: 1 } }, { session })
            await mongo.db.collection('statistics').updateOne({ email: rv.author }, { $inc: { upvotes: 1 } }, { session })
            await mongo.db.collection('user').updateOne({ email: rv.author }, { $inc: { knowledgePoints: 3 } }, { session })


          } else if (rv.upvote.includes(user.name)) { //remove from upvote
            var index = rv.upvote.findIndex(p => p == user.name)
            rv.upvote.splice(index, 1)

            //update author stats
            await mongo.db.collection('statistics').updateOne({ email: rv.author }, { $inc: { discussionPoints: -1 } }, { session })
            await mongo.db.collection('statistics').updateOne({ email: rv.author }, { $inc: { upvotes: -1 } }, { session })


          } else {
            rv.upvote.push(user.name)  //add to upvote
            //update author stats
            await mongo.db.collection('statistics').updateOne({ email: rv.author }, { $inc: { discussionPoints: 1 } }, { session })
            await mongo.db.collection('statistics').updateOne({ email: rv.author }, { $inc: { upvotes: 1 } }, { session })
            await mongo.db.collection('user').updateOne({ email: rv.author }, { $inc: { knowledgePoints: 3 } }, { session })
          }

        } else {
          //when downvote, check if user alrdy upvoted, if yes remove from upvote
          if (rv.upvote.includes(user.name)) {
            var index = rv.upvote.findIndex(p => p == user.name)
            rv.upvote.splice(index, 1)
            rv.downvote.push(user.name)

            //update author stats
            await mongo.db.collection('statistics').updateOne({ email: rv.author }, { $inc: { discussionPoints: -2 } }, { session })
            await mongo.db.collection('statistics').updateOne({ email: rv.author }, { $inc: { downvotes: 1 } }, { session })

          } else if (rv.downvote.includes(user.name)) {
            var index = rv.downvote.findIndex(p => p == user.name)
            rv.downvote.splice(index, 1)

            //update author stats
            await mongo.db.collection('statistics').updateOne({ email: rv.author }, { $inc: { discussionPoints: 2 } }, { session })
            await mongo.db.collection('statistics').updateOne({ email: rv.author }, { $inc: { downvotes: -1 } }, { session })

          } else {
            rv.downvote.push(user.name)

            //update author stats
            await mongo.db.collection('statistics').updateOne({ email: rv.author }, { $inc: { discussionPoints: -2 } }, { session })
            await mongo.db.collection('statistics').updateOne({ email: rv.author }, { $inc: { downvotes: 1 } }, { session })
          }

        }

      } catch (e) {
        await session.abortTransaction()
        res.status(500).json({ e: e.toString() })
      }



      //update document
      if (type == "message") {
        rv0 = await mongo.db.collection('messages').findOneAndUpdate({ reference: reference }, {
          $set: {
            upvote: rv.upvote,
            downvote: rv.downvote
          }
        },
          { returnOriginal: false }, { session })

      } else {
        rv0 = await mongo.db.collection('threads').findOneAndUpdate({ reference: reference }, {
          $set: {
            upvote: rv.upvote,
            downvote: rv.downvote
          }
        },
          { returnOriginal: false }, { session })
      }

      await session.commitTransaction()
      return res.status(200).json(rv0.value)
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/discussion/report', authUser, async (req, res) => {
    let { msgRef, courseRef, message, type } = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      let course = await mongo.db.collection('courses').findOne({reference: courseRef})
      if (user) {
        let body = {
          reference: uuidv4(),
          courseRef,
          title: course.title,
          msgRef,
          active: true,
          message,
          type,
          author: user.email

        }
        let rv = mongo.db.collection('reports').insertOne(body)
      }
      return res.status(200).json('success')
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  //Class related API

  .get('/class', authUser, async (req, res) => {
    let { courseRef, batchID, index, section } = req.query
    let posts = null
    try {
      if (index) {
        let rv = await mongo.db.collection('classes').findOne({ courseRef: courseRef, batchID: batchID })
        index = index.split('-')
        if (section == 'question') {
          posts = rv.feedback[index[1]]
        } else {
          posts = rv.notice[index[1]]
        }


        return res.status(200).json(posts)
      } else {

        let rv = await mongo.db.collection('classes').findOne({ courseRef: courseRef, batchID: batchID })
        return res.status(200).json(rv)
      }
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .get('/classes/list', authUser, async (req, res) => {
    let user = null
    let date = new Date().toISOString()
    let classes = null
    let regClasses = null
    let pageSize = 4
    try {
      user = await findUser({ id: req.decoded.id })
      const { email, role } = user
      if (role == "user") {
        //Registered classes
        let total = Math.ceil(await mongo.db.collection('registrations').find({ email: email, active: true }).count() /4)
        let rv = await mongo.db.collection('registrations').find({ email: email, active: true }).limit(4).toArray()
        regClasses = rv
        return res.status(200).json({ regClasses, total })
      } else {
        //Own course classes
        let totalClass = Math.ceil(await mongo.db.collection('classes').find({ instructor: email, active: true }).count() /4)
        let rv = await mongo.db.collection('classes').find({ instructor: email, active: true }).limit(4).toArray()

        //Reg Course classes
        let totalRegClass = Math.ceil(await mongo.db.collection('registrations').find({ email: email, endDate: { $gte: new Date() } }).count() /4)
        let rv2 = await mongo.db.collection('registrations').find({ email: email, endDate: { $gte: new Date() } }).limit(4).toArray()

        classes = rv
        regClasses = rv2
        return res.status(200).json({ classes, totalClass, regClasses, totalRegClass })
      }
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .get('/classes/list/update', authUser, async (req, res) => {
      let {currentPage, type} = req.query
      let user = null
      let pageSize = 4
      try {
        user = await findUser({ id: req.decoded.id })
        if(user == "user") {
          let rv = await mongo.db.collection('registrations').find({ email: email, active: true }).sort({ "_id": 1 }).skip((Number(currentPage) - 1) * pageSize).limit(Number(pageSize)).toArray()
          return res.status(200).json(rv)
        }else {
          if(type == "registered") {
            let rv2 = await mongo.db.collection('registrations').find({ email: email, endDate: { $gte: new Date() } }).skip((Number(currentPage) - 1) * pageSize).limit(Number(pageSize)).toArray()
            return res.status(200).json(rv2)
          }else {
            let rv2 = await mongo.db.collection('registrations').find({ email: email, endDate: { $gte: new Date() } }).skip((Number(currentPage) - 1) * pageSize).limit(Number(pageSize)).toArray()
            return res.status(200).json(rv2)
          }
        }
      }catch(e) {
        return res.status(500).json({ e: e.toString() })
      }
  })

  .post('/classes/post/thread', authUser, async (req, res) => {
    let { createType, tMsg, title, courseRef, batchID, fileName } = req.body
    let user = null
    let length = null
    try {
      user = await findUser({ id: req.decoded.id })
      let rv = await mongo.db.collection('classes').findOne({ courseRef: courseRef, batchID: batchID })

      length = rv[createType].length


      if (user) {
        let body = {
          id: createType + '-' + length,
          author: user.name,
          email: user.email,
          title: title,
          message: tMsg,
          created: new Date(),
          fileName,
          replies: []
        }

        if (createType == 'notice') {
          let rv2 = await mongo.db.collection('classes').findOneAndUpdate({ courseRef: courseRef, batchID: batchID }, {
            $push: {
              "notice": body
            }
          })
        } else if (createType == 'feedback') {
          let rv2 = await mongo.db.collection('classes').findOneAndUpdate({ courseRef: courseRef, batchID: batchID }, {
            $push: {
              "feedback": body
            }
          })
        }


      }
      return res.status(200).json('success')
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/classes/post/thread/message', authUser, async (req, res) => {
    let { courseRef, batchID, message, index } = req.body
    let user = null
    let length = null
    let id = index.split('-')
    try {
      user = await findUser({ id: req.decoded.id })
      let rv = await mongo.db.collection('classes').findOne({ courseRef: courseRef, batchID: batchID })

      if (user) {
        length = rv[id[0]][id[1]].replies.length

        let body = {
          id: 'reply-' + length,
          author: user.name,
          email: user.email,
          message: message,
          created: new Date().toISOString(),
        }

        if (id[0] == 'notice') {
          let rv2 = await mongo.db.collection('classes').updateOne({ courseRef: courseRef, batchID: batchID, "notice.id": index }, {
            $push: {
              "notice.$.replies": body
            }
          })
        } else if (id[0] == 'feedback') {
          let rv2 = await mongo.db.collection('classes').updateOne({ courseRef: courseRef, batchID: batchID, "feedback.id": index }, {
            $push: {
              "feedback.$.replies": body
            }
          })
        }


        return res.status(200).json('success')

      }

    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/classes/closed', authUser, async (req, res) => {
    let { courseRef, batchID } = req.body
    let user = null
    try {
      //close class document and students
      user = await findUser({ id: req.decoded.id })
      //Transaction
      const { defaultTransactionOptions, client } = mongo
      const session = client.startSession({ defaultTransactionOptions }) // for transactions
      session.startTransaction()
      try {
        await mongo.db.collection('classes').updateOne({ courseRef: courseRef, batchID: batchID }, {
          $set: {
            active: false
          }
        }, { session })
        await mongo.db.collection('registrations').updateMany({ courseRef: courseRef, batchID: batchID }, {
          $set: {
            active: false
          }
        }, { session })


        await session.commitTransaction()
        return res.status(200).json("success") //success
      } catch (e) {
        await session.abortTransaction()
        res.status(500).json({ e: e.toString() })
      }


    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  //Quiz related API

  .post('/quiz/create', authUser, async (req, res) => {
    let { courseRef, batchID, quiz, quizTitle } = req.body

    let user = null
    let length = 0
    try {
      user = await findUser({ id: req.decoded.id })
      let rv = await mongo.db.collection('classes').findOne({ courseRef: courseRef, batchID: batchID })
      if (user) {
        if (rv.quiz.length) {
          length = rv.quiz.length
        }



        let body = {
          id: 'quiz-' + length,
          author: user.name,
          email: user.email,
          title: quizTitle,
          created: new Date(),
          content: quiz
        }

        let rv2 = await mongo.db.collection('classes').findOneAndUpdate({ courseRef: courseRef, batchID: batchID }, {
          $push: {
            "quiz": body
          }
        })
      }
      return res.status(200).json('success')
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/quiz/update', authUser, async (req, res) => {
    let { courseRef, batchID, quiz, title, quizID } = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      if (user) {
        let rv = await mongo.db.collection('classes').updateOne({ courseRef: courseRef, batchID: batchID, "quiz.id": quizID }, {
          $set: {
            "quiz.$.title": title,
            "quiz.$.content": quiz
          }
        })

        if (rv) {
          return res.status(200).json('success')
        }
      }
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .post('/quiz/completed', authUser, async (req, res) => {
    let { courseRef, batchID, quizID, result } = req.body
    let user = null
    let totalScore = 0
    try {
      user = await findUser({ id: req.decoded.id })
      for (var i = 0; i < result.length; i++) {
        totalScore += result[i].points
      }
      let found = await mongo.db.collection('quizResults').findOne({ courseRef: courseRef, batchID, batchID, quizID: quizID, completedBy: user.email })
      if (found && user) {
        let rv = mongo.db.collection('quizResults').updateOne({ courseRef: courseRef, batchID, batchID, completedBy: user.email }, {
          $set: {
            result: result
          }
        })
      } else if (user) {
        let rv = mongo.db.collection('quizResults').insertOne({
          completedBy: user.email,
          name: user.name,
          completedOn: new Date().toISOString(),
          quizID: quizID,
          courseRef: courseRef,
          batchID: batchID,
          score: null,
          totalScore: totalScore,
          result: result
        })
      }

      return res.status(200).json('Completed')
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })

  .get('/quizResult', authUser, getQuizResult) //check if quiz is done before

  .get('/quiz/results', authUser, async (req, res) => {   //get all quiz documents 
    let { courseRef, batchID, quizID } = req.query

    try {
      let rv = await mongo.db.collection('quizResults').find({ courseRef: courseRef, batchID: batchID, quizID: quizID }).toArray()

      return res.status(200).json(rv)

    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }

  })

  .get('/quiz/stats', authUser, async (req, res) => {   //get all quiz documents 
    let { courseRef, batchID, quizID } = req.query
    let aggregate = {
      totalPoints: 0,
      totalScore: 0,
      Qstats: []
    }

    try {
      let count = await mongo.db.collection('quizResults').find({ courseRef: courseRef, batchID: batchID, quizID: quizID }).count()
      let rv = await mongo.db.collection('quizResults').find({ courseRef: courseRef, batchID: batchID, quizID: quizID }).toArray()


      for (var [index, item] of rv.entries()) {
        for (var [index2, item2] of item.result.entries()) {
          let template = {
            id: 'question-' + index2,
            title: "",
            points: 0,
            totalScore: 0, //to get avg score of the question
            full: 0,
            half: 0,
            zero: 0
          }

          if (aggregate.Qstats[index2] == null) {
            template.points = item2.points
            template.title = item2.title
            aggregate.Qstats.push(template)
          }

          let maxPoints = item2.points
          aggregate.totalPoints += maxPoints

          if (item2.score == maxPoints) {
            aggregate.totalScore += maxPoints
            aggregate.Qstats[index2].full += 1
            aggregate.Qstats[index2].totalScore += maxPoints

          } else if (item2.score == maxPoints / 2) {
            aggregate.totalScore += maxPoints / 2
            aggregate.Qstats[index2].half += 1
            aggregate.Qstats[index2].totalScore += maxPoints / 2
          } else {
            aggregate.Qstats[index2].zero += 1
          }
        }
      }

      //console.log("AA", aggregate)
      return res.status(200).json({ aggregate, count })

    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }

  })

  .post('/quiz/result/marked', authUser, async (req, res) => {
    let { quiz } = req.body
    let user = null
    try {
      user = await findUser({ id: req.decoded.id })
      if (user.role == 'instructor') {
        let rv = await mongo.db.collection('quizResults').findOneAndUpdate({ courseRef: quiz.courseRef, batchID: quiz.batchID, quizID: quiz.quizID, completedBy: quiz.completedBy }, {
          $set: {
            score: quiz.score,
            result: quiz.result
          }
        })

        if (rv) {
          return res.status(200).json('Completed')
        }
      }
    } catch (e) {
      return res.status(500).json({ e: e.toString() })
    }
  })





module.exports = meRoutes