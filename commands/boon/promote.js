const { MessageEmbed } = require("discord.js")
const { MessageCollector } = require("discord.js")
const { dustyrose } = require("../../json/colour.json")

module.exports = {
    config: {
        name: "promote",
        description: "promoted the specified user after checking for DB entries",
        usage: "<number>",
        category: "portal",
        aliases: ["promo", "promote"]
    },

    run: async (client, message, args) => {
        if ((message.channel.type == "dm") && (args[0])) {
            let currentFigureID;
            client.loadAvatar(args[0]).then((boonRes) => {

            const messageEmbed = new MessageEmbed()
                .setColor(dustyrose)
                .setAuthor(`Portal Promotion Portal`, client.user.displayAvatarURL)
                .setThumbnail(`https://www.mainImager.com/mainImager-imaging/avatarimage?figure=${boonRes.look}&size=l&direction=4&head_direction=3&action=crr=6&gesture=sml`)
                .setDescription(`Welcome to Portal Promotion Portal\n\nPlease react with the tick to confirm \`${args[0]}\` is the user you wish to promote.`)
                .setFooter(`Beta Testers: ${loadBetaTesters()}, Spect  - Portal`)

            let profileMatch = false;

            for (const userData of client.getAllEntries.all()) {
                const currentUID = userData.unique_id.split("-")
                if (currentUID[1] === message.author.id) {
                    profileMatch = true;
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
                                    

                                    for (const promoteeUserData of client.getAllEntries.all()){
                                        const currentUsername = promoteeUserData.boon_username

                                        let rankMatch = false;
                                        let oldRank;

                                        const currentTime = new Date()

                                        if(currentUsername.toLowerCase() === args[0].toLowerCase()){
                                            for (let key in client.rankList) {
                                                for (let newKey in client.rankList[key]) {
                                                    if(rankMatch){
                                                        rankMatch = false

                                                        messageEmbed.setDescription(`**Rank found** - Applying promotion to user ${promoteeUserData.boon_username}. \n\n**Current Rank:** ${oldRank[2]} \n**New Rank:** ${client.rankList[key][newKey]}\n\nPromotion log has been created accordingly..`)
                                                        sentMessage.edit(messageEmbed)
                                                        
                                                        client.channels.cache.get(`707312052099874911`).send(`**${promoteeUserData.boon_username}** - promoted by **${userData.boon_username}**\n${oldRank[2]} [${promoteeUserData.boon_last_promoter_tag}] \n${client.rankList[key][newKey]} [${userData.boon_tag}]\nFilling a station`)
                                                            

                                                        if(key !== parseInt(oldRank[0])) sentMessage.reply("This user has been promoted into a new divison, please make sure you ask them to request the following badge: \`NULL\`")
                                                        sentMessage.reply(`**Thank you for using BIs Promotion Portal** - please tell ${promoteeUserData.boon_username} to make there motto the following: \`[BI] ${client.rankList[key][newKey]} [${userData.boon_tag}] [${promoteeUserData.boon_tag}]\``)
                                                        
                                                        let newData = promoteeUserData
                                                        
                                                        newData.boon_rank = newKey;
                                                        newData.boon_last_promoter_tag = userData.boon_tag
                                                        newData.boon_last_promo_time = currentTime.getTime()

                                                        return client.setUserRow.run(newData)

                                                    }

                                                    if(newKey.toString() === promoteeUserData.boon_rank.toString()){
                                                        const timeMath = (Math.floor(((currentTime.getTime() - parseInt(promoteeUserData.boon_last_promo_time)) / 1000)))
                                                        key = parseInt(key)
                                                        if(!Number.isNaN(key)){
                                                            let currentNumRank = (parseInt(userData.boon_rank))

                                                            // 145 - 134

                                                            if(!Number.isNaN(newKey)){
                                                                if((currentNumRank >= 156) && (newKey <= 145)){
                                                                } else if((currentNumRank >= 146) && (newKey <= 141)){
                                                                } else if(((currentNumRank - newKey) >= 13) && (currentNumRank >= 43) && (currentNumRank <= 144)){
                                                                } else {
                                                                    return sentMessage.reply("Your rank is not high enough to promote this user!")
                                                                }

                                                            }

                                                            if(timeMath >= parseInt(key)){
                                                                rankMatch = true
                                                            
                                                                oldRank = `${key}-${newKey}-${client.rankList[key][parseInt(newKey)]}`.split("-")
                                                            } else {
                                                                messageEmbed.setColor(`#a30000`)

                                                                let currentHours = Math.floor((parseInt(key) - timeMath) /60 /60)
                                                                let currentMinutes = Math.floor((parseInt(key) - timeMath) / 60) - (currentHours * 60)
                                                                let currentSeconds = Math.floor((parseInt(key) - timeMath) % 60)

                                                                messageEmbed.setDescription(`**This user is NOT eligible for promotion** \n\nPlease wait \`\`\`${currentHours + "H:" + currentMinutes + "M:" + currentSeconds }S\`\`\` before promoting this user!`)
                                                                return sentMessage.edit(messageEmbed)
                                                            }
                                                        } else {
                                                            messageEmbed.setDescription(`**This user is NOT eligible for promotion** \n\nThis user is currently a iC member - if a promotion is required please ask a Administrator to update there profile!`)
                                                            return sentMessage.edit(messageEmbed)
                                                        }
                                                    }     
                                                }
                                            }
        
                                        }
                                    
                                    }
                                    
                                    return message.reply("The user you are searching for does not have a profile available. Please contact Die to have one created for them.")
 
                                }
                            })

                            .catch(collected => {
                                console.log(collected)
                                return sentMessage.reply(`Your promotion on \`${args[0]}\` has been cancelled.`);
                            });
                    })

                }
            }

            if(!profileMatch){
                messageEmbed.setDescription("Your discord account is not associated with a profile. Please contact Die to have this done for you. Process to automate this is coming soon.")
                return message.reply(messageEmbed)
            }
            })
        } else if((message.channel.type == "dm") && (!args[0])) {
            message.reply("In order to use this command, you need to specify which user you would like to promote. For example \`-promote Jeremiah\`")
        } else {
            message.reply("this command can only be run in my DMs. I have sent you a DM to help you get started.")
            message.author.send("The command you just run can be executed inside here. Try running it again :)")
        }

    }
}