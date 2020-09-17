const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateUrlMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateUrlMessage
}