const { MessageEmbed } = require("discord.js");

module.exports = {
  info: {
    name: "invite",
    description: "Me adicione em seu servidor",
    usage: "[invite ou convite]",
    aliases: ["convite"],
  },

  run: async function (client, message, args) {
    
    var permissions = 8;
    
    let invite = new MessageEmbed()
    .setTitle(`${client.user.username} - Music bot`)
    .setDescription(`Quer me adicionar em seu servidor?\n[Clique aqui](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot)`)
    .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot`)
    .setColor("#FF00E5")
    return message.channel.send(invite);
  },
};
