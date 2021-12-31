const { MessageEmbed } = require("discord.js")
const { dustyrose } = require("../../json/colour.json")

module.exports= { 
    config: {
        name: "train",
        description: "creates a training log and also creates a new profile for a speciifed user",
        usage: "<number>",
        category: "portal",
        aliases: ["train", "training"]
    },

    run: async (client, message, args) => {
        if(message.channel.type == "dm"){
            const messageEmbed = new MessageEmbed()
            .setColor(dustyrose)
            .setAuthor(`Portal Training Portal`, client.user.displayAvatarURL)
            .setThumbnail(client.user.displayAvatarURL)
            .setDescription(`Welcome to Portal Training Portal\n\nPlease ensure the user you wish to log is the one in the loaded image.`)
            .setFooter(`Beta Testers: ${loadBetaTesters()}, Spect  - Portal`)
            
            let profileMatch;

            for (const userData of client.getAllEntries.all()) {
                const currentUID = userData.unique_id.split("-")
                if (currentUID[1] === message.author.id) {
                    profileMatch = true
                    if(args[0]){
                        let currentFigureID;
                        client.loadAvatar(args[0]).then((boonRes) => {

                        messageEmbed.setThumbnail(`https://www.mainImager.com/mainImager-imaging/avatarimage?figure=${boonRes.look}&size=m&direction=2&head_direction=3&gesture=sml&action=wav`)
                        message.reply(messageEmbed).then(sentMessage => {
                            sentMessage.react("✅")
                            const filter = (reaction, user) => {
                                return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
                            };

                            sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                            .then(collected => {
                                const reaction = collected.first();

                                if (reaction.emoji.name === '✅') {
                                    if(!args[1]){
                                        let userRow = client.getUserRow.get(args[0])

                                        if(!userRow){
                                            messageEmbed.setDescription(`Welcome to Portal Training Portal\n\nCreating a new profile for this user as well as creating a new training log `)
                                            sentMessage.edit(messageEmbed)

                                            const currentTime = new Date()
                                            userRow = {
                                                unique_id: `${args[0]}-0001`,
                                                boon_username: args[0],
                                                boon_rank: 1,
                                                boon_tag: "N/A",
                                                boon_last_promoter_tag: userData.boon_tag,
                                                boon_last_promo_time: currentTime.getTime(),
                                                boon_total_promotions: 0,
                                                boon_total_trainings: 0,
                                                boon_strikes: 0,
                                                boon_warnings: 0,
                                                boon_ic_points: 0
                                            }


                                            client.channels.get(`709199637583757394`).send(`**${args[0]}** - trained by **${userData.boon_username}**\nRecruit Training\nAgent I [${userData.boon_tag}]`)
                                            client.setUserRow.run(userRow)

                                        } else {
                                            messageEmbed.setDescription(`Welcome to Portal Training Portal\n\nAre you sure you selected the correct training? This user already has a profile withus. Please speak to a administrator if you believe it is out of date.`)
                                            sentMessage.edit(messageEmbed)
                                        }
                                    } else {
                                        return message.reply("")
                                    }
                                }
            
                            })
                            .catch(collected => {
                                console.log(collected)
                                message.reply('The operaiton was canceled as you did not react with the tick..');
                            });

                        })
                    })
                    } else {
                        
                    }
                       
                }
                
            }

            if(!profileMatch){
                messageEmbed.setDescription("Your discord account is not associated with a profile. Please contact Die to have this done for you. Process to automate this is coming soon.")
                return message.reply(messageEmbed)
            }
        }
    }
}



