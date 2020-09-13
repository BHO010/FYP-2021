if (!process.env.NODE_ENV) { // we cannot use process.argv due to jest not passing it down... so use environment
    console.log('Exiting No Environment Specified')
    process.exit(1)
  }
  if (!APP_NAME) {
    console.log('Exiting No Application Found')
    process.exit(2)
  }
  
  const path = require('path')
  global.LIB_PATH = path.join(process.cwd(), 'common-lib') // Set Common Path || TBD use node modules
  global.APP_PATH = path.join(process.cwd(), APP_NAME) 
  