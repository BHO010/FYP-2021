export const USE_OTP = '' //process.env.VUE_APP_USE_OTP || '' // GA, SMS, ''
export const API_URL = process.env.VUE_APP_API_URL || 'http://127.0.0.1:3000' // https://127.0.0.1:3000
// export const WS_URL = process.env.VUE_APP_WS_URL || process.env.VUE_APP_WS_URL === undefined ? 'ws://127.0.0.1:3001' : '' // 'wss://echo.websocket.org'
// console.log('WS_URL', WS_URL, process.env.VUE_APP_WS_URL)

export const WS_URL = process.env.VUE_APP_WS_URL || '' // wss://127.0.0.1:3001

export const PAGESIZE = process.env.VUE_APP_PAGESIZE || 2
export const PAGESIZE_OPTS = process.env.VUE_APP_PAGESIZE_OPTS && process.env.VUE_APP_PAGESIZE_OPTS.length ? JSON.parse(process.env.VUE_APP_PAGESIZE_OPTS) : [2, 5,10]

export const HTTPONLY_TOKEN = true // true, false use HTTPONLY_TOKEN for more security, but needs same domain
export const WITH_CREDENTIALS = true // true = use same origin, false = cors

export const APP_VERSION = '1.0.1'