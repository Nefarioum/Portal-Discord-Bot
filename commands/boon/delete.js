const { MessageEmbed } = require("discord.js")
const { dustyrose } = require("../../json/colour.json")

module.exports= { 
    config: {
        name: "delete",
        description: "clears out a db entry of a profile, unreverisable",
        usage: "<number>",
        category: "portal",
        aliases: ["del", "delete"]
    },

    run: async (client, message, args) => {
        if(message.channel.type == "dm"){
            const messageEmbed = new MessageEmbed()
            .setColor(dustyrose)
            .setAuthor(`Portal Database Deletion`, client.user.displayAvatarURL)
            .setThumbnail(client.user.displayAvatarURL)
            .setDescription(`Welcome to Portal Database Deletion\n\nPlease be wary of this command as it will completely wipe out the following user profile **${args[0]}**. Logs of when this command is made.`)
            .setFooter(`Beta Testers: ${loadBetaTesters()} - Portal`)


            if(args[0]){
                messageEmbed.setThumbnail(`https://mainImager.com/imager/imager.php?username=${args[0]}`)
                message.reply(messageEmbed).then(sentMessage => {
                    sentMessage.react("✅")
                    const filter = (reaction, user) => {
                        return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
                    };

                    sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === '✅') {
                            messageEmbed.setDescription(`Welcome to Portal Database Deletion\n\nSearching the DB for the specified username......`)
                            sentMessage.edit(messageEmbed)

                            let userRow = client.getUserRow.get(args[0])

                            if(userRow){
                                client.deleteUserRow.run(args[0])
                                
                                messageEmbed.setDescription(`Welcome to Portal Database Deletion\n\nThe following user **${args[0]}** was found in the database and was removed.`)
                                return sentMessage.edit(messageEmbed)
                            }
                            messageEmbed.setDescription(`Welcome to Portal Database Deletion\n\nNo entries for **${args[0]}** was found in the database. Are you sure this is the correct spelling?`)
                            return sentMessage.edit(messageEmbed)
                        }
    
                    })
                    .catch(collected => {
                        console.log(collected)
                        message.reply('The operaiton was canceled as you did not react with the tick..');
                    });

                })
               
            } else {
                let currentAmount = 1
                let currentString = ""
                for(const userData of client.getAllEntries.all()){
                    currentString = currentString + `\n**User #${currentAmount}** - ${userData.boon_username}\n[${userData.boon_tag}]\n${userData.boon_rank}`
                    currentAmount++
                }
                return message.reply(currentString)
            }
        }
    }
}



