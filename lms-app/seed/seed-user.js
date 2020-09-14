const user = [
    {
        email: 'user',
        password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', //
        gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
        role: 'user', // partner, user, admin,
        contactNumber: '',
        signupDate: new Date(), // trial for 7 days unless within subscriptionExpiryDate
        active: true,
        myReferalCode: 'AAAAAAAA', // how to generate this?
        referer: '',  // none='', facebook, google, referal
        refererCode: '', // the referrer code
        createdAt: 'admin',
        createdBy: new Date(),
        updatedAt: '',
        updatedBy: '',
        revoked: '' // if not empty, user is revoked
    },
    {
        email: 'admin',
        password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', //
        gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
        role: 'admin', // partner, user, admin,
        contactNumber: '',
        signupDate: new Date(), // trial for 7 days unless within subscriptionExpiryDate
        active: true,
        myReferalCode: 'BBBBBBBB', // how to generate this?
        referer: '',  // none='', facebook, google, referal
        refererCode: '', // the referrer code
        createdAt: 'admin',
        createdBy: new Date(),
        updatedAt: '',
        updatedBy: '',
        revoked: '' // if not empty, user is revoked
    }
]

module.exports = user