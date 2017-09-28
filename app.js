const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.Promise = Promise
const http = require('http')

let config = require('./config/config')
let io = require('socket.io')
let app = express()
let server = http.createServer(app)
io = io.listen(server)

//Websocket
io.on('connection', (socket)=>{
  socket.on('new post', (post)=>{
    io.emit('new post', {author: post.author, body: post.body})
  })
})

//Middleware
app.use(bodyParser.json())
app.use(express.static(__dirname+'/assets'))
app.use(require('./auth'))

//Połączenie z bazą
mongoose.connect(config.database,{useMongoClient: true},()=>{
  console.log('Połączono z bazą')
})

//Routing
app.use(require('./assets/routes/users.js'))
app.use(require('./assets/routes/posts.js'))

//Nieznane ścieżki
app.get('*',(req, res, next)=>{
  res.locals.user = req.user || null
  res.redirect('/')
})

//Serwer
server.listen(process.env.PORT || 3000,()=>{
  console.log("Serwer nasłuchuje na porcie 3000")
})
