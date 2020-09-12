//Global variable
const path = require('path');
global.LIB_PATH = path.join(process.cwd(), 'common-lib') // Set Common Path 
global.APP_PATH = path.join(process.cwd()) 

const express = require('express');
const mongo = require(LIB_PATH + '/services/db/mongodb')

const cors = require('cors');
const app = express();

//Middlewares
app.use(express.json()); //Used to parse JSON bodies
app.use(cors())

//Import routes
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth")
app.use('/api', apiRoutes)
app.use('/auth', authRoutes)

app.listen(3000, () =>
  console.log('LMS app listening on port 3000!'),
);

//connect to mongoDB
mongo.open(require('./config'))


