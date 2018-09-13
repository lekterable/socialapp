const bodyParser = require('body-parser')
const express = require('express')
const config = require('./config/config')
let app = express()
const mongoose = require('mongoose')
mongoose.Promise = Promise

//Database connection
mongoose.connect(
  config.database,
  { useMongoClient: true }
)

//Middleware
app.use(bodyParser.json())
app.use(express.static(__dirname + '/assets'))
app.use(require('./auth'))

//Routing
app.use('/api', require('./routes/users.js'))
app.use('/api', require('./routes/posts.js'))

//Other routes
app.get('*', (req, res, next) => {
  res.redirect('/')
})

module.exports = app
