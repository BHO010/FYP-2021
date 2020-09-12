const express = require('express');
const mongo = require('mongodb');
const cors = require('cors')
const app = express();
const { MONGO_URL, MONGO_DB} = require('./config')


//middlewares
app.use(express.json()); //Used to parse JSON bodies
app.use(cors())

//Import routes
const apiRoutes = require("./routes/api");

app.use('/api', apiRoutes)

app.listen(3000, () =>
  console.log('LMS app listening on port 3000!'),
);

//connect to mongoDB
mongo.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to mongodb')
     
});


