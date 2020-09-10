const socket = io()
//Elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = document.querySelector("input")
const $messageFormButton = document.querySelector("button")
const $locationButton = document.querySelector("#send-location")
const $messages = document.querySelector("#messages")

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const urlTemplate = document.querySelector("#url-template").innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message : message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on("locationMessage", (url) => {
    const html = Mustache.render(urlTemplate, {
        url : url.text,
        createdAt : moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //disable
    $messageFormButton.setAttribute('disabled', 'disabled')
    const newMsg = e.target.elements.newMsg.value
   
    socket.emit('sendMessage', newMsg, (error) => {
       //enable
       $messageFormButton.removeAttribute('disabled')
       $messageFormInput.value = '';
       $messageFormInput.focus()
        if(error){
           return console.log(error)
       }
       console.log("Message Delivered.", message)
    })
})

$locationButton.addEventListener("click", () => {
    if(!navigator.geolocation){
        return alert('Geo Location is not supppreted by your browser')
    }
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position.geolocation.coords.latitude)
        const location = {
            'latitude' : position['coords']['latitude'],
            'longitude' : position['coords']['longitude']
        }
        
        socket.emit('sendLocation', location, (error) => {
            $locationButton.removeAttribute('disabled')
            if(error){
                return console.log(error)
            }
            else
                console.log("Location Sent")
        })
    })
})

