const { MessageEmbed } = require("discord.js")
const { dustyrose } = require("../json/colour.json")

module.exports = async (client, message, args) => {
    const messageEmbed = new MessageEmbed()
    .setColor(dustyrose)
    .setAuthor(`Portal Bot Logs`, client.user.displayAvatarURL)
    //.setDescription("A command has been executed in my DMs. More information can be found below regarding the command")
    .addField("Command Ran", message.content, true)
    .addField("User who ran command", message.author.username, true)
    .setFooter(`User ID: ${message.author.id} | Portal Bot`)

    client.channels.cache.get(`709068308758003754`).send(messageEmbed)
}