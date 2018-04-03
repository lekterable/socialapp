const mongoose = require('mongoose')
mongoose.Promise = Promise
const http = require('http')

const config = require('./config/config')
const io = require('socket.io')
const app = require('./app')
let server = http.createServer(app)
io = io.listen(server)

//Websocket
io.on('connection', (socket)=>{
  socket.on('new post', (post)=>{
    io.emit('new post', {author: post.author, body: post.body})
  })
})

//Database connection
mongoose.connect(config.database,{useMongoClient: true},()=>{
    console.log('Connected with database')
})

//Server
server.listen(process.env.PORT || 3000,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})
  