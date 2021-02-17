let statsTemplate = {
    email: "",
    registered: 0,
    courseCreated: 0,
    reviewsCount: 0,
    upvotes: 0,
    downvotes: 0,
    discussionPoints: 0,
    profileLikes: 0,
    studentsCount: 0,
    activeCategory: ""
}

let achievementTemplate = {
    email: "",
    achievements: [
        {
            id: "registered",
            info: "Number of courses completed",
            title: "Learner Badge",
            role: "user",
            url: "",
            level: 0,
            multiplier: 50,
            nextReq: 3
        },
        {
            id: "upvotes",
            info: "Number of likes obtained",
            title: "Constructive Learner",
            role: "user",
            url: "",
            level: 0,
            multiplier: 50,
            nextReq: 40
        },
        {
            id: "downvotes",
            info: "Number of dislikes obtained",
            title: "Destructive Learner",
            role: "user",
            url: "",
            level: 0,
            multiplier: 50,
            nextReq: 40
        },
        {
            id: "discussionPoints",
            info: "Number of comments on discussion",
            title: "Active Community",
            role: "user",
            url: "",
            level: 0,
            multiplier: 50,
            nextReq: 50
        },
        //instructor
        /* {
            id: "profileLikes",
            info: "Number of likes on profile",
            title: "Learner",
            level: 0,
            points: 0,
            nextReq: 0
        }, */
        {
            id: "studentsCount",
            info: "Number of Students",
            title: "Teacher Badge",
            url: "",
            level: 0,
            multiplier: 50,
            nextReq: 100
        },
        {
           id: "courseCreated",
           info: "Number of courses created",
           title: "Spread Your knowledge",
           url: "",
           level: 0,
           multiplier: 50,
           nextReq: 3
       },
       {
           id: "reviewsCount",
           info: "Number of reviews given",
           title: "Feedback Badge",
           url: "",
           level: 0,
           multiplier: 50,
           nextReq: 40
       }
    ]    
}

let rank = ["Novice", "Apprentice", "Master", "GrandMaster", "Sage"]

function getStatsTemplate () {
    return statsTemplate
}

function getAchievementTemplate () {
    return achievementTemplate
}

function updateAchievements(data) {
    //data == achievements array

}


module.exports = {
    getStatsTemplate,
    getAchievementTemplate,
    updateAchievements
}