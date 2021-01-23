const { MessageEmbed } = require('discord.js')

module.exports = {
    info: {
        name: "help",
        description: "To show all commands",
        usage: "[command]",
        aliases: ["commands", "help me", "pls help"]
    },

    run: async function(client, message, args){
        var allcmds = "";

        client.commands.forEach(cmd => {
            let cmdinfo = cmd.info
            allcmds+="`"+client.config.prefix+cmdinfo.name+" "+cmdinfo.usage+"` ~ "+cmdinfo.description+"\n"
        })

        let embed = new MessageEmbed()
        .setColor("PURPLE")
        .setDescription("Todos os comandos")
        .setFooter(`To get info of each command you can do ${client.config.prefix}help [command] | Hander by ItzCutePikachu#2006`)

        if(!args[0])return message.channel.send(embed)
        else {
            let cmd = args[0]
            let command = client.commands.get(cmd)
            if(!command)command = client.commands.find(x => x.info.aliases.includes(cmd))
            if(!command)return message.channel.send("Este comando não existe")
            let commandinfo = new MessageEmbed()
            .setTitle("Comando: "+command.info.name+" info")
            .setColor("PURPLE")
            .setDescription(`
Name: ${command.info.name}
Descrição: ${command.info.description}
Modo de usar: \`\`${client.config.prefix}${command.info.name} ${command.info.usage}\`\`
Aliases: ${command.info.aliases.join(", ")}
`)
            message.channel.send(commandinfo)
        }
    }
}
