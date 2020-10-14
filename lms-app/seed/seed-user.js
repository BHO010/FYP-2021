const user = [
    {
        email: 'user',
        password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', //
        gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
        role: 'user', // instructor, user, admin,
        contactNumber: '',
        signupDate: new Date(), 
        active: true,
        createdAt: 'admin',
        createdBy: new Date(),
        revoked: '' // if not empty, user is revoked
    },
    {
        email: 'admin',
        password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', //
        gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
        role: 'admin', // instructor, user, admin,
        contactNumber: '',
        signupDate: new Date(), 
        active: true,
        createdAt: 'admin',
        createdBy: new Date(),
        revoked: '' // if not empty, user is revoked
    },
    {
        email: 'user2',
        password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', //
        gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
        role: 'instructor', // instructor, user, admin,
        contactNumber: '',
        signupDate: new Date(), 
        active: true,
        createdAt: 'admin',
        createdBy: new Date(),
        revoked: '' // if not empty, user is revoked
    }
]

module.exports = user