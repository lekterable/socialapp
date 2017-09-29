const router = require('express').Router()
const bcrypt = require('bcryptjs')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')
let User = require('../models/user')

router.get('/users/authenticate', (req, res)=>{
  jwt.verify(req.headers['x-auth'], config.secret,(err, decoded)=>{
    if(err)
      return res.json({success: false, message: 'Token nieprawidłowy'})
    return res.json({success: true, message: decoded.data})
  })
})

router.post('/users/login', (req, res)=>{
  User.findOne({username: req.body.username}, (err, user)=>{
    if(err)
        throw err
      if(!user)
        return res.json({success: false, message: 'Nie znaleziono użytkownika'})
      bcrypt.compare(req.body.password, user.password, (err, isMatch)=>{
        if(err)
          throw err
        if(isMatch) {
          let token = jwt.sign({data:user}, config.secret)
          return res.json({success: true, message: token})
        }
        else
          return res.json({success: false, message: 'Nieprawidłowe hasło'})
  })
})})

router.post('/users/register',(req, res)=>{
  let newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
  })
  bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(newUser.password, salt, (err, hash)=>{
        if(err)
          return res.json({success: false, message: 'Niepoprawne hasło'})
        else {
          newUser.password = hash
          newUser.save((err)=>{
            if (err)
              return res.json({success: false, message: 'Użytkownik już istnieje'})
            else{
              return res.json({success: true, message: 'Zarejestrowano pomyślnie'})
            }
          })
        }
      })
    })
})

module.exports = router
