const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const HttpError = require('./models/http-error')

const app = express()

app.use(bodyParser.json())

app.use((req,res,next)=>{
    throw new HttpError('Unable to find method | path', 500)
})

app.use((error, req, res, next)=>{
    if(res.headerSent){
        return next(error)
    }
    res.status(error.status | 500).json({message: error.message | 'Unable to complete request'})
})

mongoose.connect(process.env.DB_STRING, { useUnifiedTopology: true, useNewUrlParser: true }).then(()=>{
    console.log('COnnected to DB...')
    app.listen(5000)
}).catch(error=>{
    console.log(error)
})