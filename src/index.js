const http = require("http")
const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const Filter = require("bad-words")
const {generateMessage, generateUrlMessage} = require('./utils/messages')
const {addUser, getUser, getUsersInRoom, removeUser} = require('./utils/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log("New Web Socket Connection")
    
    socket.on('join', (options, callback) => {
        const {error, user} = addUser({id:socket.id, ...options})
        if(error){
            return callback()
        }
        socket.join(user.room)
        //socket.emit, io.emit, socket.broadcast.emit, io.to.emit, socket.broadcast.to.emit
        socket.emit("message", generateMessage('Admin', 'Welcome !'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))
        io.to(user.room).emit("roomData", {
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    
    })    
    
    socket.on('sendMessage', (newMsg, callback) => {
        const filter = new Filter()
        if(filter.isProfane(newMsg)){
            return callback("Profanity is not allowed")
        }
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(user.username, newMsg))
        callback('delivered')
    })

    socket.on('disconnect', () => {
        const  user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit("message", generateMessage('Admin', `${user.username} had left!`))
            io.to(user.room).emit("roomData", {
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })

    socket.on('sendLocation', (location, callback) =>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateUrlMessage(user.username, `https://www.google.com/maps?q=${location.latitude},${location.longitude}`))
        callback("Location Shared.")
    })

    
})
server.listen(port, () => {
    console.log(`Server is UP & Running on post ${port}.`)
})
