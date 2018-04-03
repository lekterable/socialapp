const bodyParser = require('body-parser')
const express = require('express')
let app = express()

//Middleware
app.use(bodyParser.json())
app.use(express.static(__dirname+'/assets'))
app.use(require('./auth'))

//Routing
app.use('/api', require('./assets/routes/users.js'))
app.use('/api', require('./assets/routes/posts.js'))

//Nieznane ścieżki
app.get('*',(req, res, next)=>{
  res.locals.user = req.user || null
  res.redirect('/')
})

module.exports = app