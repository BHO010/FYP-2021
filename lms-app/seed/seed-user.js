const user = [
    {
        email: 'user',
        password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', //
        role: 'user', // instructor, user, admin,
        active: true,
        pwCode: "",
        activeTags: [],
        contactNumber: '',
        knowledgePoints: 0,
        level: 1,
        name: "",
        profileImage: "",
        signupDate: new Date(), 
        notifications: []
    },
    {
        email: 'admin',
        password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', //
        role: 'admin', // instructor, user, admin,
        pwCode: "",
        activeTags: [],
        contactNumber: '',
        knowledgePoints: 0,
        level: 1,
        name: "",
        profileImage: "",
        signupDate: new Date(), 
        active: true,
        notifications: []
    },
    {
        email: 'user2',
        password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', //
        role: 'instructor', // instructor, user, admin,
        pwCode: "",
        activeTags: [],
        contactNumber: '',
        knowledgePoints: 0,
        level: 1,
        name: "",
        profileImage: "",
        signupDate: new Date(), 
        active: true,
        notifications: []
    }
]

module.exports = user