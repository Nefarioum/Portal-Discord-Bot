module.exports= { 
    config: {
        name: "test",
        description: "replies back with hello",
        usage: "",
        category: "miscellaneous",
        aliases: ["hello", "test"]
    },

    run: async (client, message, args) => {
        message.reply(" you have pinged me!")
    }
}
