const { MONGO_URL, MONGO_DB, JWT_REFRESH_STORE_NAME, JWT_REFRESH_EXPIRY,JWT_REFRESH_STORE } = require('../config')


let db
const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
client.connect(async err => {
  if (!err) {
    try {
      db = client.db(MONGO_DB)

      // Create JWT User Session Store
      if (JWT_REFRESH_STORE === 'mongo') {
        await db.collection(JWT_REFRESH_STORE_NAME).deleteMany({})
        await db.collection(JWT_REFRESH_STORE_NAME).createIndex({ id: 1 }, { unique: true })
        await db.collection(JWT_REFRESH_STORE_NAME).createIndex( { setAt: 1 }, { expireAfterSeconds: JWT_REFRESH_EXPIRY } )  
      }

      const user = require('./seed-user')
      await db.collection('user').deleteMany({})
      await db.collection('user').createIndex({ email: 1 }, { unique: true })
      await db.collection('user').createIndex({ myReferalCode: 1 }, { unique: true })
      await db.collection('user').createIndex({ active: 1 })
      await db.collection('user').insertMany(user)

      client.close()
      process.exit(0)
    } catch (e) {
      console.log(e.toString())
      process.exit(1)
    }
  }
  else {
    console.log(err)
  }
})