//jshint esversion:6
require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('connected', ()=>{
  console.log('mongoose is connected');
})

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password']
  }
})
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model('User', userSchema)



app.get('/', (req, res)=>{
  res.render('home')
})
app.get('/login', (req, res)=>{
  res.render('login')
})
app.get('/register', (req, res)=>{
  res.render('register')
})
app.get('/submit', (req, res)=>{
  res.render('submit')
})

app.post('/register', (req, res)=>{
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save((err)=>{
    if(!err){
      res.render('secrets')
    }else{
      console.log(err);
    }
  })
})
app.post('/login', (req, res)=>{
  const userName = req.body.username
  const password = req.body.password
  User.findOne({email: userName}, (err, foundUser)=>{
    if(foundUser){
      if(foundUser.password === password){
        res.render('secrets')
      }
      else{res.send('You enter a wrong password')}
    }
    else{res.send(err)}
  })
})


const port = process.env.Port || 3000
app.listen(port, ()=>{
  console.log('Server is running on port: '+ port);
})