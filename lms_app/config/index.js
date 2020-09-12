
module.exports = {

//Mongo
MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/LMS',
MONGO_DB: 'LMS',

// JWT - secret key
JWT_ALG: process.env.JWT_ALG || 'HS256', // 'RS256' (use SSL certs), 'HS256' (use secret string)
JWT_SECRET: process.env.JWT_SECRET || '123456789', // HS256
JWT_EXPIRY: process.env.JWT_EXPIRY || '5d', // '150d', '15d', '15m', '15s', use small expiry to test refresh mechanism
JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || 864000, // do not allow refresh handling after X seconds
JWT_REFRESH_STORE: process.env.JWT_REFRESH_STORE || 'keyv', // mongo, database, redis, keyv (default)
JWT_REFRESH_STORE_NAME: process.env.JWT_REFRESH_STORE_NAME || 'user_session', // collection or table name

}