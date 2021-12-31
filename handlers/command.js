const { readdirSync } = require("fs")

module.exports = (client) =>{
const load = dirs => {
    const commandHandler = readdirSync(`./commands/${dirs}/`).filter(e => e.endsWith('.js'));
    for (let file of commandHandler) {
        let command = require(`../commands/${dirs}/${file}`);
        client.commands.set(command.config.name, command);

        if(command.config.aliases) command.config.aliases.forEach(c => client.aliases.set(c, command.config.name));
        }
    } 
    ["miscellaneous", "boon", "owner"].forEach(c => load(c));
}

