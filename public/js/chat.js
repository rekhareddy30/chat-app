const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

//const typeMessage = document.querySelector("#newMsg")
document.querySelector("#message-form").addEventListener('submit', (e) => {
    e.preventDefault()
    const newMsg = e.target.elements.newMsg.value
   
    socket.emit('sendMessage', newMsg)
})

document.querySelector('#send-location').addEventListener("click", () => {
    if(!navigator.geolocation){
        return alert('Geo Location is not supppreted by your browser')
    }
    
    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position.geolocation.coords.latitude)
        const location = {
            'latitude' : position['coords']['latitude'],
            'longitude' : position['coords']['longitude']
        }
        
        socket.emit('sendLocation', location)
    })
})