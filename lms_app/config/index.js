
module.exports = {

SALT_ROUNDS: process.env.SALT_ROUNDS || 12,

// OTP
USE_OTP: process.env.USE_OTP || 'TEST', // GA, SMS, '' (also on FE)
OTP_EXPIRY: process.env.OTP_EXPIRY || '1m', // allow 1 minute for user to do OTP

// ## CACHING CAN USE REDIS INSTEAD
// KEYV_CACHE=redis://localhost:6379
KEYV_CACHE: process.env.KEYV_CACHE || '',
 
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

// AUTH
AUTH_USER_STORE: process.env.AUTH_USER_STORE || 'mongo',
AUTH_USER_STORE_NAME: process.env.AUTH_USER_STORE_NAME || 'user',
AUTH_USER_FIELD_ID_FOR_JWT: process.env.AUTH_USER_FIELD_ID_FOR_JWT || '_id', // mongo = _id, database = id // can be NTID from SAML
AUTH_USER_FIELD_GROUPS_FOR_JWT: process.env.AUTH_USER_FIELD_GROUPS_FOR_JWT || 'role', // can be AD Groups from SAML
AUTH_USER_FIELD_LOGIN: process.env.AUTH_USER_FIELD_LOGIN || 'email', 
AUTH_USER_FIELD_PASSWORD: process.env.AUTH_USER_FIELD_PASSWORD || 'password', 
AUTH_USER_FIELD_GAKEY: process.env.AUTH_USER_FIELD_GAKEY || 'gaKey', 


}

