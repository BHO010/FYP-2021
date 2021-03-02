const express = require('express')
const cron = require('node-cron');
const scheduleRoutes = express.Router()

const mongo = require(LIB_PATH + '/services/db/mongodb')



scheduleRoutes
cron.schedule('1 1 * * *', async function () {
    try {
        //get all active registration and those that haven't been alerted
        let date = new Date().getTime()
        let knowledgePoints = 0
        let rv = await mongo.db.collection('registrations').find({ active: true, endAlert: false }).toArray()

        //Transaction
        const { defaultTransactionOptions, client } = mongo
        const session = client.startSession({ defaultTransactionOptions }) // for transactions
        session.startTransaction()
        try {
            for (var item of rv) {
                let endDate = new Date(item.endDate).getTime()
                let course = await mongo.db.collection('courses').findOne({ reference: item.courseRef })
                //check if course is over and update
                if (endDate < date) {
                    let user = await mongo.db.collection('user').findOne({ email: item.email })
                    //survey notification template
                    let template = {
                        reference: item.courseRef, //course reference to get survey
                        title: item.title, //course title
                        header: "Course Completion Survey",
                        type: "survey",
                        content: 'You have completed ' + item.title + '.'
                    }

                    let templateII = {
                        title: item.title, //course title
                        instructor: course.createdBy, //instructor email
                        courseRef: item.courseRef,
                        type: "review",
                        header: "Instructor's Review",
                        content: 'Submit a review for ' + item.title + 'instructor.'
                    }

                    //check if already in notifications array and add if not
                    var index = user.notifications.findIndex(p => p.reference == item.courseRef)
                    var indexII = user.notifications.findIndex(p => p.courseRef == item.courseRef && p.type == "review")
                    if (index < 0) {
                        user.notifications.push(template)
                    }

                    if (indexII < 0) {
                        user.notifications.push(templateII)
                    }

                    //Get points for user
                    if (course.level == "Basic") {
                        knowledgePoints = 100
                    } else if (course.level == "Intermediate") {
                        knowledgePoints = 200
                    } else {
                        knowledgePoints = 400
                    }

                    //Update User
                    await mongo.db.collection('user').updateOne({ email: item.email }, {
                        $set: {
                            notifications: user.notifications,
                            knowledgePoints: knowledgePoints
                        }
                    }, {session})

                    await mongo.db.collection('registrations').updateOne({ email: item.email }, {
                        $set: {
                            endAlert: true
                        }
                    }, {session})

                }
            }
            await session.commitTransaction()
        } catch (e) {
            await session.abortTransaction()
            res.status(500).json({ e: e.toString() })
        }
        return session.endSession()
        console.log("This run at midnight everyday " + date)
    } catch (e) {
        return res.status(500).json({ e: e.toString() })
    }
});

module.exports = scheduleRoutes