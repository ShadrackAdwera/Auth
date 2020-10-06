const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const HttpError = require('./models/http-error')
const authRoutes = require('./routes/auth-route')

const app = express()

app.use(bodyParser.json())

app.use('/api/auth', authRoutes)

app.use((req, res, next) => {
    throw new HttpError('Could not find the method / route. Try Again', 500);
  });
  
  app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res
      .status(error.code || 500)
      .json({ error: error.message || 'An error occured, try again' });
  });

mongoose.connect(process.env.DB_STRING, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).then(()=>{
    console.log('COnnected to DB...')
    app.listen(5000)
}).catch(error=>{
    console.log(error)
})