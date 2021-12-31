const { MessageEmbed } = require("discord.js")
const { MessageCollector } = require("discord.js")
const { dustyrose } = require("../../json/colour.json")

module.exports = {
    config: {
        name: "transfer",
        description: "transfers the selected user and creates a profile for them",
        usage: "<number>",
        category: "portal",
        aliases: ["transfer"]
    },

    run: async (client, message, args) => {
        if ((message.channel.type == "dm") && (args[0])) {
            let currentFigureID;
            client.loadAvatar(args[0]).then((boonRes) => {

            const messageEmbed = new MessageEmbed()
                .setColor(dustyrose)
                .setAuthor(`Portal Transfer Portal`, client.user.displayAvatarURL())
                .setThumbnail(`https://www.mainImager.com/mainImager-imaging/avatarimage?figure=${boonRes.look}&size=l&direction=4&head_direction=3&action=crr=6&gesture=sml`)
                .setDescription(`Welcome to Portal Transfer Portal\n\nPlease react with the tick to confirm \`${args[0]}\` is the user you wish to transfer.`)
                .setFooter(`Beta Testers: ${loadBetaTesters()}, Spect  - Portal`)

                let profileMatch = false;

                for (const userData of client.getAllEntries.all()) {
                    const currentUID = userData.unique_id.split("-")

                    if(currentUID[1] === message.author.id){
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
                                        let userRow = client.getUserRow.get(args[0])

                                        if(userRow) {
                                            messageEmbed.setDescription(`Welcome to Portal Transfer Portal\n\nThis user already exists on our database! If you think this is out of date, please contact an Administrator to reset there profile!`)
                                            messageEmbed.setAuthor(`Portal Transfer Portal`, `https://i.imgur.com/JC5YWan.png`)
                                            return sentMessage.edit(messageEmbed)
                                        } else {
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

                                            messageEmbed.setDescription(`Welcome to Portal Transfer Portal\n\nIn the process of creating this user!`)
                                            messageEmbed.setAuthor(`Portal Transfer Portal`,`https://i.imgur.com/rF3QaUP.png`)
                                            return sentMessage.edit(messageEmbed)
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
            
        } else if((message.channel.type == "dm") && (!args[0])) {
            message.reply("In order to use this command, you need to specify which user you would like to promote. For example \`-promote Jeremiah\`")
        } else {
            message.reply("this command can only be run in my DMs. I have sent you a DM to help you get started.")
            message.author.send("The command you just run can be executed inside here. Try running it again :)")
        }

    }
}