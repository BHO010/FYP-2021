const fs = require('fs')
const path = require('path')

const GCP_KEY = require('./' + process.env.NODE_ENV + '.gcp.json') || ''

const JWT_CERTS_PATH = process.env.JWT_CERTS_PATH || '' // RS256
const HTTPS_CERTS_PATH = process.env.HTTPS_CERTS_PATH || ''

let jwtCerts
let httpsCerts

if (!httpsCerts && HTTPS_CERTS_PATH) httpsCerts = (HTTPS_CERTS_PATH) ? { key: fs.readFileSync(`${HTTPS_CERTS_PATH}.key`), cert: fs.readFileSync(`${HTTPS_CERTS_PATH}.crt`) } : null
if (!jwtCerts && JWT_CERTS_PATH) jwtCerts = (JWT_CERTS_PATH) ? { key: fs.readFileSync(`${JWT_CERTS_PATH}.key`), cert: fs.readFileSync(`${JWT_CERTS_PATH}.crt`) } : ''

module.exports = {    

 // CERTS
 httpsCerts,
 jwtCerts,    

// PORTS
API_PORT: process.env.API_PORT || 3000, // (also on FE)
WS_PORT: process.env.WS_PORT || null, // (also on FE)

SALT_ROUNDS: process.env.SALT_ROUNDS || 12,

// OTP
USE_OTP: process.env.USE_OTP || 'TEST', // GA, SMS, '' (also on FE)
OTP_EXPIRY: process.env.OTP_EXPIRY || '1m', // allow 1 minute for user to do OTP

USE_HTTPS: process.env.USE_HTTPS || false, // USE_HTTPS should be path to letsencrypt location OR false 

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

GCP_KEY,
FCM_SERVER_KEY: process.env.FCM_SERVER_KEY || '',
GCP_DEFAULT_BUCKET: process.env.GCP_DEFAULT_BUCKET || '',
GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT || GCP_KEY.project_id,

// Communications - Sendgrid
SENDGRID_KEY: process.env.SENDGRID_KEY || '',
SENDGRID_SENDER: process.env.SENDGRID_SENDER || '',

// HTTPONLY COOKIES
HTTPONLY_TOKEN: true, // true, false (also set the same on FE..., true means place token in HttpOnly cookie) - DO TAKE NOTE OF CORS

PROXY_WWW_ORIGIN: '', // 'http://127.0.0.1:8080', // used by proxy middleware
// CORS_OPTIONS: null, // if withCredentials === false at Frontend
CORS_OPTIONS: { // set withCredentials === true at Frontend
  // exposedHeaders: ['refresh-token'], // allow this to be sent back in response
  // maxAge
  // allowedHeaders
  // credentials

  // default cors settings
  // origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  responseHeader: ["*"],
  // ALLOW CORS
  credentials: true, // Access-Control-Allow-Credentials value to true
  origin: "http://127.0.0.1:8080,http://127.0.0.1:8081"
},
CORS_ORIGINS: process.env.CORS_ORIGINS || '*', // http://127.0.0.1:8080

}

