module.exports= { 
    config: {
        name: "say",
        description: "sends a message to a channel then deleted",
        usage: "<channel> <text here>",
        category: "owner",
        aliases: ["say", "message"]
    },

    run: async (client, message, args) => {
        if(message.channel.type == "dm") return message.channel.send("rip.")
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("rip.")

        // Core
        if (args.join(' ').length <= 0 || args.join(' ') === "-") return message.channel.send("The format for a say is: `-say #channel stuff here`");
        if (!message.mentions.channels.first().id) return message.channel.send("Please include a channel to send the message to!")

        let announcemessage = args.join(' ');
        let announcementChannel = client.channels.get(message.mentions.channels.first().id)

        announcemessage = announcemessage.replace(args[0], "")
        announcementChannel.send(announcemessage)

        setTimeout(() => {
            message.delete()
        }, 3000);
    }
}