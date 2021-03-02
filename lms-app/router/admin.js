const path = require('path')
const express = require('express')
const adminRoutes = express.Router()

const bcrypt = require('bcryptjs')
const otplib = require('otplib')
const { SALT_ROUNDS, UPLOAD_FOLDER, httpsCerts, MONGO_DB } = require('../config')
const { v4: uuidv4 } = require('uuid');

const { findUser } = require(LIB_PATH + '/auth')
const { authUser, authIsAdmin } = require('../middlewares/auth')

const mongo = require(LIB_PATH + '/services/db/mongodb')
const { ObjectID } = require('mongodb')
const multer = require('multer')


adminRoutes
    .get('/', authUser, authIsAdmin, async (req, res) => {
        try {
            let user = await findUser({ id: req.decoded.id })

            if (user.role == "admin") {
                res.status(200).json(user)
            } 
        } catch (e) {
            res.status(500).json({ e: e.toString() })
        }

    })

    .get('/stats', authUser, authIsAdmin, async (req, res) => {
        try {
            let userCount = await mongo.db.collection('user').find({ role: "user" }).count()
            let instructorCount = await mongo.db.collection('user').find({ role: "instructor" }).count()
            let courseCount = await mongo.db.collection('courses').find({ active: true }).count()
            let classesCount = await mongo.db.collection('classes').find({}).count()
            let regCount = await mongo.db.collection('registrations').find({}).count()

            let results = {
                userCount,
                instructorCount,
                courseCount,
                classesCount,
                regCount
            }

            res.status(200).json(results)
        } catch (e) {
            res.status(500).json({ e: e.toString() })
        }

    })

    .get('/reports', authUser, authIsAdmin, async (req, res) => {
        let { options } = req.query
        try {
            options = JSON.parse(options)
            let page = options.page
            let limit = options.itemsPerPage
            let results = null
            const total = await mongo.db.collection('reports').find({ active: true }).count()
            if (limit > 0) {
                results = await mongo.db.collection('reports').find({ active: true }).skip((Number(page) - 1) * Number(limit)).limit(Number(limit)).toArray()
            } else {
                results = await mongo.db.collection('reports').find({ active: true }).toArray()
            }

            res.status(200).json({ results, total })
        } catch (e) {
            res.status(500).json({ e: e.toString() })
        }
    })

    .get('/reportDetails', authUser, authIsAdmin, async (req, res) => {
        let { data } = req.query
        let reportedMessage = null
        data = JSON.parse(data)
        try {
            if (data.type == "threads") {
                reportedMessage = await mongo.db.collection('threads').findOne({ reference: data.msgRef })
            } else {
                reportedMessage = await mongo.db.collection('messages').findOne({ reference: data.msgRef })
            }

            let template = {
                reporter: data.author,
                message: data.message,
                reportee: reportedMessage.author,
                reportedMessage: reportedMessage.message
            }

            res.status(200).json(template)
        } catch (e) {
            res.status(500).json({ e: e.toString() })
        }
    })

    .post('/report/delete', authUser, authIsAdmin, async (req, res) => {
        let { data } = req.body
        try {
            //Transaction
            const { defaultTransactionOptions, client } = mongo
            const session = client.startSession({ defaultTransactionOptions }) // for transactions
            session.startTransaction()
            try {
                if (data.type == "threads") {
                    await mongo.db.collection('threads').updateOne({ reference: data.msgRef }, {
                        $set: {
                            message: "Deleted By Admin"
                        }
                    }, { session })
                } else {
                    await mongo.db.collection('messages').updateOne({ reference: data.msgRef }, {
                        $set: {
                            message: "Deleted By Admin"
                        }
                    }, { session })
                }

                //Give points to user that reported this.
                await mongo.db.collection('user').updateOne({ email: data.author }, {
                    $inc: {
                        knowedgePoints: 10
                    }
                }, { session })

                //Close report document in db
                await mongo.db.collection('reports').updateOne({ reference: data.reference }, {
                    $set: {
                        active: false
                    }
                }, { session })

                await session.commitTransaction()
                return res.status(200).json({ success: true, msg: 'Report Approved' }) //success
            } catch (e) {
                await session.abortTransaction()
                res.status(500).json({ e: e.toString() })
            }
        } catch (e) {
            res.status(500).json({ e: e.toString() })
        }
    })

    .post('/report/ignore', authUser, authIsAdmin, async (req, res) => {
        let { data } = req.body

        try {
            //Close report document in db
            await mongo.db.collection('reports').updateOne({ reference: data.reference }, {
                $set: {
                    active: false
                }
            })

            return res.status(200).json({ success: true, msg: 'Report Ignored' }) //success
        } catch (e) {
            res.status(500).json({ e: e.toString() })
        }
    })

    .get('/courses', authUser, authIsAdmin, async (req, res) => {
        let { search, searchCategory, options } = req.query
        try {
            options = JSON.parse(options)
            let filter = {}
            if (searchCategory == "Title" && search) {
                filter.title = { $regex: search, $options: 'i' }
            } else if (searchCategory == "Instructor" && search) {
                filter.createdBy = { $regex: search, $options: 'i' }
            } else if (searchCategory == "Category" && search) {
                filter.category = { $regex: search, $options: 'i' }
            }
            let page = options.page
            let limit = options.itemsPerPage
            let results = null
            const total = await mongo.db.collection('courses').find(filter).count()
            if (limit > 0) {
                results = await mongo.db.collection('courses').find(filter).skip((Number(page) - 1) * Number(limit)).limit(Number(limit)).toArray()
            } else {
                results = await mongo.db.collection('courses').find(filter).toArray()
            }

            res.status(200).json({ results, total })
        } catch (e) {
            res.status(500).json({ e: e.toString() })
        }
    })

module.exports = adminRoutes