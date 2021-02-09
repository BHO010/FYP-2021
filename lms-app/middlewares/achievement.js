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
    courseTaken: {
        info: "Number of courses registered",
        title: "Learner Badge",
        level: 0,
    },
    courseCreated: {
        info: "Number of courses created",
        title: "Teacher Badge",
        level: 0,
    },
    reviewsCount: {
        info: "Number of reviews given",
        title: "Feedback Badge",
        level: 0,
    },
    maxLikes: {
        info: "Number of likes obtained",
        title: "Constructive Learner",
        level: 0,
    },
    maxDislikes: {
        info: "Number of dislikes obtained",
        title: "Destructive Learner",
        level: 0,
    },
    discussionPoints: {
        info: "Number of comments on discussion",
        title: "Active Community",
        level: 0,
    },
    profileLikes: {
        info: "Number of likes on profile",
        title: "Learner",
        level: 0,
    },
    studentsCount: {
        info: "Number of courses registered",
        title: "Learner",
        level: 0,
    },
    activeCategory: ""
}

function getStatsTemplate () {
    return statsTemplate
}

function getAchievementTemplate () {
    return achievementTemplate
}


module.exports = {
    getStatsTemplate,
    getAchievementTemplate,
}