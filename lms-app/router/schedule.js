const express = require('express')
const cron = require('node-cron');
const scheduleRoutes = express.Router()

const mongo = require(LIB_PATH + '/services/db/mongodb')



scheduleRoutes
cron.schedule('0 0 * * *', async function() {
    try {
        //get all active registration
        let date = new Date().getTime()
        let knowledgePoints = 0
        let rv = await mongo.db.collection('registrations').find({active: true}).toArray()

        for(var item of rv) {

            let endDate = new Date(item.endDate).getTime()
            let course = await mongo.db.collection('courses').findOne({reference: item.courseRef})

            //check if course is over and update
            if(endDate < date) { 
                let user = await mongo.db.collection('user').findOne({email: item.email})
                //survey notification template
                let template = {
                    reference: item.reference, //course reference to get survey
                    title: item.title, //course title
                    type: "survey"
                }

                let templateII = {
                    title: item.title, //course title
                    instructor: course.createdBy,
                    type: "review"
                }

                //check if already in notifications array and add if not
                var index = user.notifications.findIndex(p => p.reference == item.reference) 
                var indexII = user.notifications.findIndex(p => p.title == item.title && p.type == "review") 
                if(index < 0) {
                    user.notifications.push(template)
                }

                if(indexII < 0) {
                    user.notifications.push(templateII)
                }
                
                //Get points for user
                if(rv.level == "Basic") {
                    knowledgePoints = 100
                }else if(rv.level == "Intermediate") {
                    knowledgePoints = 200
                }else {
                    knowledgePoints = 400
                }

                //Update User

                await mongo.db.collection('user').updateOne({email: item.email}, {
                    $set: {
                        notifications: user.notifications,
                        knowledgePoints: knowledgePoints
                    }
                })
            }
        }
        
        console.log("This run at midnight everyday " + date)
    }catch(e) {

    }
});

module.exports = scheduleRoutes