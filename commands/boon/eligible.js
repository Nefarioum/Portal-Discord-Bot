const { MessageEmbed, Attachment } = require("discord.js")
const { MessageCollector } = require("discord.js")
const { dustyrose } = require("../../json/colour.json")

module.exports = {
    config: {
        name: "eligible",
        description: "checks if the selected user is eligible for a promotion",
        usage: "<number>",
        category: "portal",
        aliases: ["eligible", "eligiblecheck"]
    },

    run: async (client, message, args) => {
        if ((message.channel.type == "dm") && (args[0])) {
            let currentFigureID;
            client.loadAvatar(args[0]).then((boonRes) => {

            const messageEmbed = new MessageEmbed()
                .setColor(dustyrose)
                .setAuthor(`Portal Eligible Check`, client.user.displayAvatarURL())
                .setThumbnail(`https://www.mainImager.com/mainImager-imaging/avatarimage?figure=${boonRes.look}&size=l&direction=4&head_direction=3&action=crr=6&gesture=sml`)
                .setDescription(`Welcome to Portal Eligible Check\n\nPlease react with the tick to confirm \`${args[0]}\` is the user you wish to look-up.`)
                .setFooter(`Beta Testers: ${loadBetaTesters()}, Spect  - Portal`)


                let profileMatch = false;

                for (const userData of client.getAllEntries.all()) {
                    const currentUID = userData.unique_id.split("-")
                    if(currentUID[1] === message.author.id){
                        profileMatch = true

                        message.reply(messageEmbed).then(sentMessage => {
                            sentMessage.react("✅")
    
                            const filter = (reaction, user) => {
                                return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
                            };
    
                            sentMessage.awaitReactions(filter, {
                                    max: 1,
                                    time: 60000,
                                    errors: ['time']
                                })
                                .then(collected => {
                                    const reaction = collected.first();
    
                                    if (reaction.emoji.name === '✅') {
                                        messageEmbed.setDescription("**Confirmation Recieved** - currently searching through DB for user.")
                                        sentMessage.edit(messageEmbed)

                                        const promoteeData = client.getUserRow.get(args[0])

                                        if(!promoteeData){
                                            messageEmbed.setThumbnail('https://i.imgur.com/JC5YWan.png')
                                            messageEmbed.setDescription("The account you have searched for does not exist in our database. Are you sure you have spelt it correctly? Please consult to an Administrator if this issue persists.")
                                            return message.reply(messageEmbed)
                                        } else {
                                            let rankMatch;
                                            for (let key in client.rankList) {
                                                for (let newKey in client.rankList[key]) {
                                                    if(newKey == promoteeData.boon_rank){
                                                        rankMatch = key
                                                    }
                                                }
                                            }
                                            
                                            console.log(`${rankMatch}`)

                                            const currentTime = new Date()
                                            const timeMath = (Math.floor(((currentTime.getTime() - parseInt(promoteeData.boon_last_promo_time)) / 1000)))
                                            
                                            if(timeMath >= parseInt(rankMatch)){
                                                messageEmbed.setThumbnail('https://i.imgur.com/rF3QaUP.png')
                                                messageEmbed.setColor('#008000'); messageEmbed.setDescription(`**User ${promoteeData.boon_username} is now eligible for a promotion!**\n\n You can use the command \`-promote ${promoteeData.boon_username}\` in my DMs to promote this user!`)
                                                return sentMessage.edit(messageEmbed)
                                            } else {
                                                let currentHours = Math.floor((parseInt(rankMatch) - timeMath) /60 /60)
                                                let currentMinutes = Math.floor((parseInt(rankMatch) - timeMath) / 60) - (currentHours * 60)
                                                let currentSeconds = Math.floor((parseInt(rankMatch) - timeMath) % 60)

                                                messageEmbed.setThumbnail('https://i.imgur.com/JC5YWan.png')
                                                messageEmbed.setColor('#FF0000'); messageEmbed.setDescription(`**User ${promoteeData.boon_username} is not eligible for a promotion!**\n\n Please wait \`\`\`${currentHours}H:${currentMinutes}M:${currentSeconds}S\`\`\` before this user is eligible for promotion.`)
                                                return sentMessage.edit(messageEmbed)
                                            }


    
                                        }
                                    }
                                })
                        })
                    }
                }

                if(!profileMatch){
                    messageEmbed.setDescription("Your discord account is not associated with a profile. Please contact Die to have this done for you. Process to automate this is coming soon.")
                    return message.reply(messageEmbed)
                }

            })
        }
    }
}

