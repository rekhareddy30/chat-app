const http = require("http")
const express = require('express')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

io.on('connection', (socket) => {
    console.log("New Web Socket Connection")
    
    socket.emit("message", 'Welcome!')
    socket.broadcast.emit('message', "A new User Joined.")
    socket.on('sendMessage', (newMsg) => {
        io.emit('message', newMsg)
    })

    socket.on('disconnect', () => {
        io.emit("message", "A user has left")
    })

    socket.on('sendLocation', (location) =>{
        io.emit('message', `https://www.google.com/maps?q=${location.latitude},${location.longitude}`)
    })
})
server.listen(port, () => {
    console.log(`Server is UP & Running on post ${port}.`)
})
