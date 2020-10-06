const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const csrf = require('csurf')

const HttpError = require('./models/http-error')
const authRoutes = require('./routes/auth-route')

const app = express()
const csrfProtection = csrf()

app.use(bodyParser.json())
app.use(csrfProtection)

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'PUT, PATCH, POST, DELETE, GET'
    );
    next();
  });

app.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken()
})

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
    console.log(error.message)
})