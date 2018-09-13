const router = require('express').Router()
const bcrypt = require('bcryptjs')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

router.get('/users/authenticate', (req, res) => {
  jwt.verify(req.headers['x-auth'], config.secret, (err, decoded) => {
    if (err)
      return res.status(400).json({ success: false, message: 'Invalid token' })
    return res.status(200).json({ success: true, message: decoded.data })
  })
})

router.post('/users/register', (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email)
    return res
      .status(400)
      .json({ success: false, message: 'Fill all required fields' })
  let newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  })
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) return console.error(err)
      else {
        newUser.password = hash
        newUser.save(err => {
          if (err)
            return res
              .status(400)
              .json({ success: false, message: 'User already exists' })
          else {
            return res
              .status(200)
              .json({ success: true, message: 'Registered' })
          }
        })
      }
    })
  })
})

router.post('/users/login', (req, res) => {
  if (!req.body.username || !req.body.password)
    return res
      .status(400)
      .json({ success: false, message: 'No username or password provided' })
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return console.error(err)
    if (!user)
      return res.status(400).json({ success: false, message: 'User not found' })
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) return console.error(err)
      if (isMatch) {
        let token = jwt.sign({ data: user }, config.secret)
        return res.status(200).json({ success: true, message: token })
      } else
        return res
          .status(400)
          .json({ success: false, message: 'Invalid password' })
    })
  })
})

module.exports = router
