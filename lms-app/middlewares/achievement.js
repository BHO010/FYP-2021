let statsTemplate = {
    email: "",
    registered: 0,
    courseCreated: 0,
    reviewsCount: 0,
    maxLikes: 0,
    maxDislikes: 0,
    discussionPoints: 0,
    profileLikes: 0,
    studentsCount: 0,
    activeCategory: ""
}

let achievementTemplate = {
    email: "",
    achievements: [
        {
            id: "courseTaken",
            info: "Number of courses completed",
            title: "Learner Badge",
            level: 0,
            points: 0,
            nextReq: 1
        },
        {
             //instructor
            id: "courseCreated",
            info: "Number of courses created",
            title: "Spread Your knowledge",
            level: 0,
            points: 0,
            nextReq: 1
        },
        {
            id: "reviewsCount",
            info: "Number of reviews given",
            title: "Feedback Badge",
            level: 0,
            points: 0,
            nextReq: 5
        },
        {
            id: "maxLikes",
            info: "Number of likes obtained",
            title: "Constructive Learner",
            level: 0,
            points: 0,
            nextReq: 10
        },
        {
            id: "maxDislikes",
            info: "Number of dislikes obtained",
            title: "Destructive Learner",
            level: 0,
            points: 0,
            nextReq: 10
        },
        {
            id: "discussionPoints",
            info: "Number of comments on discussion",
            title: "Active Community",
            level: 0,
            points: 0,
            nextReq: 10
        },
        {
            //instructor
            id: "profileLikes",
            info: "Number of likes on profile",
            title: "Learner",
            level: 0,
            points: 0,
            nextReq: 0
        },
        {
            id: "studentsCount",
            info: "Number of Students",
            title: "Teacher Badge",
            level: 0,
            points: 0,
            nextReq: 0
        }
    ]    
}

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