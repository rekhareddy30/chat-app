const http = require("http")
const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const Filter = require("bad-words")
const {generateMessage, generateUrlMessage} = require('./utils/messages')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log("New Web Socket Connection")
    
    socket.on('join', ({username, room}) => {
        socket.join(room)
        //socket.emit, io.emit, socket.broadcast.emit, io.to.emit, socket.broadcast.to.emit
        socket.emit("message", generateMessage('Welcome !'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`))
    
    })    
    
    socket.on('sendMessage', (newMsg, callback) => {
        const filter = new Filter()
        if(filter.isProfane(newMsg)){
            return callback("Profanity is not allowed")
        }

        io.to('North').emit('message', generateMessage(newMsg))
        callback('delivered')
    })

    socket.on('disconnect', () => {
        io.emit("message", generateMessage("A user has left"))
    })

    socket.on('sendLocation', (location, callback) =>{
        io.emit('locationMessage', generateUrlMessage(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`))
        callback("Location Shared.")
    })

    
})
server.listen(port, () => {
    console.log(`Server is UP & Running on post ${port}.`)
})
