let jwt = require('jsonwebtoken')
let config = require('./config/config')

module.exports = (req, res, next)=>{
  if (req.headers['x-auth']) {
    jwt.verify(req.headers['x-auth'], config.secret, (err, decoded)=>{
      req.auth = decoded.data
    })
  }
  next()
}
