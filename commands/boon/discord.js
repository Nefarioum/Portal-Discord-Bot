const { MessageEmbed } = require("discord.js")
const { dustyrose } = require("../../json/colour.json")

module.exports= { 
    config: {
        name: "discord",
        description: "links a user discord account to a profile",
        usage: "<number>",
        category: "portal",
        aliases: ["discord", "disc"]
    },

    run: async (client, message, args) => {
        if((message.channel.type == "dm") && (args[0]) && args[1]){

            const messageEmbed = new MessageEmbed()
            .setColor(dustyrose)
            .setAuthor(`Portal Discord Link`, client.user.displayAvatarURL)
            .setThumbnail(client.user.displayAvatarURL)
            .setDescription(`Welcome to Portal Discord Portal - discord account linking process..\n\nPlease confirm if you would like to perform a DB association with the following entities: <@${args[0]}> with ${args[1]}`)
            .setFooter(`Beta Testers: ${loadBetaTesters()}, Spect  | Portal Bot`)
            
            message.reply(messageEmbed).then(sentMessage => {
                sentMessage.react("✅")
                const filter = (reaction, user) => {
                    return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                sentMessage.awaitReactions(filter, {
                    max: 1,
                    time: 60000,
                    errors: ['time']
                }).then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '✅') {
                        messageEmbed.setDescription(`Welcome to Portal Discord Portal - discord account linking process..\n\nConfirmation recieved, running DB queries to find account...`)    
                        sentMessage.edit(messageEmbed)

                        for(const userData of client.getAllEntries.all()){
                            let doubleMatch = false;
                            const currentUID = userData.unique_id.split("-")

                            if(currentUID[1].toString() === args[0].toString()){
                                doubleMatch = true;
                                sentMessage.reply(`This discord account is already associated with a profile (${userData.boon_username}). Would you like to de-associate the account?`).then(userReply => {
                                    userReply.react("✅")
                                    userReply.react("🛑")
                                    const filter = (reaction, user) => {
                                        return ['✅', '🛑'].includes(reaction.emoji.name) && user.id === message.author.id;
                                    };

                                    userReply.awaitReactions(filter, {
                                        max: 1, 
                                        time: 60000,
                                        errors: ['time'] 
                                    }).then(collected => {
                                        const reaction = collected.first();

                                        if (reaction.emoji.name === '✅') {
                                            client.updateID.run(`${currentUID[0]}-0001`, userData.unique_id)
                                            return message.reply(`The discord account has now been de-associated with the profile! Please run this command again to add it to a profile.`)
                                        } else {
                                            return message.reply(`Discord account de-association has been cancelled. Please run the \`-discord <id> <profile>\` again if you wish to de-associate a account.`);
                                        }
                                    })
                                    .catch(collected => {
                                        return message.reply(`Discord account de-association has been cancelled. Please run the \`-discord <id> <profile>\` again if you wish to de-associate a account.`);
                                    });

                                })
                            }

                            if(userData.boon_username === args[1]){
                                if(currentUID[1] === "0001"){
                                    client.updateID.run(`${currentUID[0]}-${args[0]}`, `${currentUID[0]}-0001`)
                                    return message.reply("The account migration was successful! You have now linked this profile to the discord user.")
                                } else if(!doubleMatch){
                                    return message.reply("The profile you have selected is already associated with a discord account. The ability to unassociate will be incorporated soon.")
                                }
                            } 
                        }
                    }
                })
                    
                .catch(collected => {
                    console.log(collected)
                    sentMessage.reply(`Your user creation on \`${args[0]}\` has been cancelled.`);
                });
            })
        }
    }
}



