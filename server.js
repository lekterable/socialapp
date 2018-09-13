const http = require('http')
const app = require('./app')
let server = http.createServer(app)
const socketIO = require('socket.io')
let io = socketIO.listen(server)

//Websocket
io.on('connection', socket => {
  socket.on('new post', post => {
    io.emit('new post', { author: post.author, body: post.body })
  })
})

//Server
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`)
})
