const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const generateUrlMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateUrlMessage
}