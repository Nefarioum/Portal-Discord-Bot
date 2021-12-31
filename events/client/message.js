const { prefix } = require("../../json/botconfiguration.json")

module.exports = async (client, message) => {
    if (message.author.bot) return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g)
    let command = args.shift().toLowerCase()

    if (message.channel.type == "dm" && message.content.startsWith("-")){ let loggerFile = require(`../../handlers/logger.js`); loggerFile(client, message, args)}

    if (!message.content.startsWith(prefix)) return;
    let commandFile = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if(commandFile) commandFile.run(client, message, args)

}