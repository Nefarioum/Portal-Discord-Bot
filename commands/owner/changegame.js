module.exports= { 
    config: {
        name: "changegame",
        description: "changes the game the bot is playing",
        usage: "<text here>",
        category: "owner",
        aliases: ["changegame", "playing"]
    },

    run: async (client, message, args) => {
        if(message.channel.type == "dm") return message.channel.send("rip.")
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("rip.")
        
        let Game = args.join(' ');
        client.user.setActivity(Game, {type: "PLAYING"});

        message.reply(" I have changed my playing status!")
    }   
}