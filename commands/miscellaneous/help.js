const { MessageEmbed } = require("discord.js")
const { prefix } = require("../../json/botconfiguration.json")
const { readdirSync } = require("fs")
const { stripIndents } = require("common-tags")
const { dustyrose } = require("../../json/colour.json")

module.exports= { 
    config: {
        name: "help",
        aliases: ["help", "commands"],
        description: "shows all of the bot commands in a embed",
        usage: "<optional: command name>",
        category: "miscellaneous",
        accessableby: "Members"
    },

    run: async (client, message, args) => {
        if(message.channel.type == "dm") return message.channel.send("rip.")

        const helpEmbed = new MessageEmbed()
            .setColor(dustyrose)
            .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL)
            .setThumbnail(client.user.displayAvatarURL)
            .setFooter(`Beta Testers: ${loadBetaTesters()}, Spect | Portal Bot`)

        if(!args[0]){
            const embedCategories = readdirSync("./commands/")

            helpEmbed.setDescription(`Here are the available commands for ${message.guild.me.displayName}\nThe bot prefix is: \`${prefix}\``)
            helpEmbed.setFooter(`${message.guild.me.displayName} | Total Commands: ${client.commands.size} `, client.user.displayAvatarURL)

            embedCategories.forEach(category => {
                const directory = client.commands.filter(c => c.config.category === category)
                const letterCaps = category.slice(0, 1).toUpperCase() + category.slice(1)

                try {
                    helpEmbed.addField(`〉 ${letterCaps} [${directory.size}]:`, directory.map(c => `\`${c.config.name}\``).join(" "))
                } catch(error) {
                    console.log(error)
                }   
            })

            return message.channel.send(helpEmbed)

        } else {
            let botCommands = client.commands.get(client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
            if(!botCommands) return message.channel.send(helpEmbed.setTitle("Invalid Command").setDescription(`Do \`${prefix}help\` for the list of commands.`))
            botCommands = botCommands.config

            helpEmbed.setDescription(stripIndents`The bot's set prefix is: \`${prefix}\`\n
                **Command:** ${botCommands.name.slice(0, 1).toUpperCase() + botCommands.name.slice(1)}
                **Description:** ${botCommands.description || "No description has been added to this command"}
                **Usage:** ${botCommands.usage ? `\`${prefix}${botCommands.name} ${botCommands.usage}\`` : "No usage added"}
                **Accessiable by:** ${botCommands.accessableby || "Members"}
                **Aliases:** ${botCommands.aliases ? botCommands.aliases.join(", ") : "None"}`)

            return message.channel.send(helpEmbed)
        }
    }
}