const { MessageEmbed } = require("discord.js")
const { MessageCollector } = require("discord.js")
const { dustyrose } = require("../../json/colour.json")

module.exports = {
    config: {
        name: "user",
        description: "creates/adds a new user to a table if not already created",
        usage: "<number>",
        category: "portal",
        aliases: ["user-create", "user", "newuser"]
    },

    run: async (client, message, args) => {
        if ((message.channel.type == "dm") && (args[0])) {
            const messageEmbed = new MessageEmbed()
                .setColor(dustyrose)
                .setAuthor(`Portal User Creation`, client.user.displayAvatarURL())
                .setThumbnail(client.user.displayAvatarURL)
                .setDescription(`Welcome to Portal Discord Portal - welcome to the user creation phase.\n\nPlease confirm data creation for user \`${args[0]}\`.`)
                .setFooter(`Beta Testers: ${loadBetaTesters()}, Spect  | Portal Bot`)

            message.reply(messageEmbed).then(sentMessage => {
                    let userRow = client.getUserRow.get(args[0])
                    if (!userRow) {
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
                                    let isCancelled = false
                                    const reaction = collected.first();

                                    if (reaction.emoji.name === '✅') {
                                        const currentTime = new Date()
                                        userRow = {
                                            unique_id: `${args[0]}-0001`,
                                            boon_username: args[0],
                                            boon_rank: 1,
                                            boon_tag: "N/A",
                                            boon_last_promoter_tag: "N/A",
                                            boon_last_promo_time: currentTime.getTime(),
                                            boon_total_promotions: 0,
                                            boon_total_trainings: 0,
                                            boon_strikes: 0,
                                            boon_warnings: 0,
                                            boon_ic_points: 0
                                        }

                                        const messageHandler = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
                                            time: 10000
                                        });
                                        sentMessage.reply("[User Setup Wizard] Please enter the tag you would like to associate with this profile or say cancel end this process.")
                                        messageHandler.on('collect', newMsg => {
                                            if(newMsg.content === "cancel"){
                                                isCancelled = true
                                                messageHandler.stop()
                                            } else if ((newMsg.content).length <= 4) {
                                                userRow.boon_tag = newMsg.content
                                                sentMessage.reply(`[User Setup Wizard] Added the tag of \`${newMsg.content}\` to the profile.`)
                                                messageHandler.stop()
                                            } else {
                                                sentMessage.reply(`[User Setup Wizard] The tag \`${newMsg.content}\` is not valid.`)
                                            }
                                        })

                                        messageHandler.on('end', collected => {
                                            if (isCancelled === true) { return message.reply("You have cancelled this user creation session.") }
                                            if (collected.size <= 0) {
                                                sentMessage.reply("[User Setup Wizard] No tag has been associated with the account.")
                                                
                                            }
                                            const messageHandler2 = new MessageCollector(message.channel, m2 => m2.author.id === message.author.id, {
                                                time: 20000
                                            });

                                            sentMessage.reply("[User Setup Wizard] Please enter the last promoter tag you would like to associate with this profile or say cancel end this process.")
                                            messageHandler2.on('collect', newMsg2 => {
                                                if(newMsg2.content === "cancel"){
                                                    isCancelled = true
                                                    messageHandler2.stop()
                                                } else if ((newMsg2.content).length <= 4) {
                                                    userRow.boon_last_promoter_tag = newMsg2.content
                                                    sentMessage.reply(`[User Setup Wizard] Added the last promoter tag of \`${newMsg2.content}\` to the profile.`)
                                                    messageHandler2.stop()
                                                } else {
                                                    sentMessage.reply(`[User Setup Wizard] The tag \`${newMsg2.content}\` is not valid.`)
                                                }
                                            })
                                            
                                            messageHandler2.on('end', collected2 => {
                                                if (isCancelled === true) { return message.reply("You have cancelled this user creation session.") }
                                                if (collected2.size <= 0) {
                                                    sentMessage.reply("No tag has been associated with the account.")
                                                }
                                                
                                                const rankGrabber = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
                                                    time: 20000
                                                });

                                                sentMessage.reply("[User Setup Wizard] Please enter the rank or rank ID you would like to associate with this profile or say cancel end this process.")
                                                rankGrabber.on('collect', rankEntered => {
                                                    let matchFound = false
                                                    if(rankEntered.content === "cancel"){
                                                        isCancelled = true
                                                        rankGrabber.stop()
                                                    } else {
                                                        for(let key in client.rankList) {
                                                            for(let newKey in client.rankList[key]){
                                                                if((client.rankList[key][newKey]).toLowerCase() === rankEntered.content.toLowerCase()){
                                                                    userRow.boon_rank = newKey
                                                                    sentMessage.reply(`The rank of \`${client.rankList[key][newKey]}\` has been selected for this profile.`)
                                                                    matchFound = true
                                                                    rankGrabber.stop()
                                                                } else if(newKey.toString() === rankEntered.content) {
                                                                    userRow.boon_rank = newKey
                                                                    sentMessage.reply(`The rank of \`${client.rankList[key][newKey]}\` has been selected for this profile.`)
                                                                    matchFound = true
                                                                    rankGrabber.stop()
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if(matchFound == false && isCancelled == false){sentMessage.reply(`The rank of ${rankEntered.content} was not found. Please try again.`)}
                                                })

                                                rankGrabber.on('end', collected3 => {
                                                    if (isCancelled === true) { return message.reply("You have cancelled this user creation session.") }
                                                    if (collected3.size <= 0) {
                                                        sentMessage.reply("No rank has been associated with the account.")
                                                    }

                                                    messageEmbed.setDescription(`Welcome to Portal Discord Portal - welcome to the user creation phase.\n\nA new entry for user \`${args[0]}\` has now been created with tag \`${userRow.boon_tag}\` and last promoter tag \`${userRow.boon_last_promoter_tag}\`. This user can now eligible to be used in the \`-promote\` command.`)
                                                    sentMessage.reply(messageEmbed)
                                                        
                                                    client.setUserRow.run(userRow)
                                                });  
                                            })
                                        })
                                }
                            })
                    .catch(collected => {
                        console.log(collected)
                        sentMessage.reply(`Your user creation on \`${args[0]}\` has been cancelled.`);
                    });
                } else {
                    messageEmbed.setDescription(`Data for \`${args[0]}\` already exists. \n\n **Saved User Info**\n\n Unique ID = \`${userRow.unique_id}\` \n Boon Username = \`${userRow.boon_username}\` \n Boon Rank = \`${userRow.boon_rank}\` \n Boon Tag = \`[${userRow.boon_tag}]\` \n Boon Last Promoter Tag = \`[${userRow.boon_last_promoter_tag}]\` \n Boon Total Promotions = \`${userRow.boon_total_promotions}\` \n Boon Total Trainings = \`${userRow.boon_total_trainings}\` \n Boon iC Points = \`${userRow.boon_ic_points}\``)
                    sentMessage.edit(messageEmbed)
                }

            })
    } else {
        message.reply("Please DM me to use this command.")
    }
}
}