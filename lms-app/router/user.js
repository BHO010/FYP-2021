const path = require('path')
const express = require('express')
const userRoutes = express.Router()

const bcrypt = require('bcryptjs')
const otplib = require('otplib')
const { SALT_ROUNDS, UPLOAD_FOLDER, httpsCerts, MONGO_DB } = require('../config')
const { v4: uuidv4 } = require('uuid');

const { findUser } = require(LIB_PATH + '/auth')
const { authUser, authIsAdmin } = require('../middlewares/auth')

const mongo = require(LIB_PATH + '/services/db/mongodb')
const { ObjectID } = require('mongodb')
const multer = require('multer')


userRoutes
    .get('/', authUser, authIsAdmin, async (req, res) => {
        let {role, options, search} = req.query
        /* try {
            const filter = {}
            let attr = "email"
            let sor = 1
            let results = ''
            const { role = '', email = '', sort = '', page = 1, limit = 50 } = req.query
            if (email) filter.email = { $regex: email, $options: 'i' }
            if (role) filter.role = { $regex: role, $options: 'i' }
            if (sort) {
                sort_a = sort.split(',')
                attr = sort_a[0]
                sor = sort_a[1]
                sor == "desc" ? sor = -1 : sor = 1
            }
            console.log("BB", filter)
            const projection = {}
            const total = await mongo.db.collection('user').find(filter, projection).count()
            results = await mongo.db.collection('user').find(filter, projection).sort({ email: sor }).skip((Number(page) - 1) * Number(limit)).limit(Number(limit)).toArray()

            res.status(200).json({ results, total })
        } catch (e) {
            res.status(500).json({ e: e.toString() })
        } */

        try {
            options = JSON.parse(options)
            let filter = {
                role: role
            }
            if(search) {
                filter.email = { $regex: search, $options: 'i' }
            }
            let page = options.page
            let limit = options.itemsPerPage
            let results = null
            const total = await mongo.db.collection('user').find(filter).count()
            if(limit > 0) {
               results = await mongo.db.collection('user').find(filter).skip((Number(page) - 1) * Number(limit)).limit(Number(limit)).toArray()
            }else {
               results = await mongo.db.collection('user').find(filter).toArray()
            }
            
            res.status(200).json({ results, total })
        }catch(e) {
            res.status(500).json({ e: e.toString() })
        }

    })

    .post('/delete',authUser, authIsAdmin, async (req,res) => {
        let {data} = req.body
        try {
            await mongo.db.collection('user').updateOne({email: data.email}, {
                $set: {
                    active: false
                }
            })
            res.status(200).json({msg: "Deleted Successfully"})
        }catch(e) {
            res.status(500).json({ e: e.toString() })
        }
    })

module.exports = userRoutes