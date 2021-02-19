const { MessageEmbed } = require('discord.js')

module.exports = {
    info: {
        name: "help",
        description: "",
        usage: "[help, comandos ou ajuda]",
        aliases: ["comandos", "ajuda"]
    },

    run: async function(client, message, args){
        var allcmds = "";

        client.commands.forEach(cmd => {
            let cmdinfo = cmd.info
            allcmds+="`"+client.config.prefix+cmdinfo.name+" "+cmdinfo.usage+"` **-** "+cmdinfo.description+"\n"
        })

        let embed = new MessageEmbed()
        .setAuthor("Lista de comandos")
        .setColor("#FF00E5")
        .setDescription(allcmds)
        return message.channel.send(embed)
      }
 }