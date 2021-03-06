const jwt = require('jsonwebtoken')
const config = require('./config/config')

module.exports = (req, res, next) => {
  if (req.headers['x-auth']) {
    jwt.verify(req.headers['x-auth'], config.secret, (err, decoded) => {
      if (err) return console.error(err)
      req.auth = decoded.data
    })
  }
  next()
}
