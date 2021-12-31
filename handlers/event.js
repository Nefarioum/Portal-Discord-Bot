const { readdirSync } = require("fs")

module.exports = (client) =>{
const load = dirs => {
    const eventHandler = readdirSync(`./events/${dirs}`).filter(e => e.endsWith('.js'))
    for (let file of eventHandler) {
        const event = require(`../events/${dirs}/${file}`)
        let eventName = file.split(".")[0]

        client.on(eventName, event.bind(null, client))
        }
    } 
    ["client", "guild"].forEach(c => load(c))
}