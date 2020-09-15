const { requiresArg } = require("yargs")

const users = []

//Add Users
const addUser = ({id, username, room}) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return {
            error:'User Name & Room Required'
        }
    }

    //check for existing user
    const existingUser = users.find( (user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser){
        return {
            error: "Username is in Use"
        }
    }

    //store User
    const user = {id, username, room}
    users.push(user)
    return {user}
}
//Remove Users
const removeUser = (id) => {
    const index =users.findIndex( (user) => user.id === id )
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}
//GetUser
const getUser = (id) => {
    return users.find( (user) => user.id === id)
}
//getUsers in Room
const getUsersInRoom = (room) => {
    return users.filter( (user) => user.room === room)

}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}