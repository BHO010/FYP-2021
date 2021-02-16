const express = require('express')
const cron = require('node-cron');
const scheduleRoutes = express.Router()

const mongo = require(LIB_PATH + '/services/db/mongodb')



scheduleRoutes
cron.schedule('* * * * *', async function() {
    try {
        //get all active registration
        let date = new Date().getTime()
        let rv = await mongo.db.collection('registrations').find({active: true}).toArray()

        for(var item of rv) {
            //Check endDate is < currentDate
            let endDate = new Date(item.endDate).getTime()

            if(endDate < date) { //Means course is over...
                let user = await mongo.db.collection('user').findOne({email: item.email})
                //notification template
                let template = {
                    reference: item.reference, //course reference to get survey
                    title: item.title //course title
                }

                //check if already in notifications array
                var index = user.notifications.findIndex(p => p.reference == item.reference) 

                if(index < 0) {
                    user.notifications.push(template)
                }
            }
        }
        
        console.log("This run every minute")
    }catch(e) {

    }
});

module.exports = scheduleRoutes