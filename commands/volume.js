const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "volume",
    description: "Altera o volume da música",
    usage: "<Volume>",
    aliases: ["v", "vol"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("Você precisa está conectado a um canal de voz", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Não há uma música tocando", message.channel);
    if (!serverQueue.connection) return sendError("Não há uma música tocando", message.channel);
    if (!args[0])return message.channel.send(`O volume atual é **${serverQueue.volume}/100**`);
     if(isNaN(args[0])) return message.channel.send('Digite um **número** para alterar o volume').catch(err => console.log(err));
    if(parseInt(args[0]) > 150 ||(args[0]) < 0) return sendError('O volume máximo é de 150',message.channel).catch(err => console.log(err));
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
   // let xd = new MessageEmbed()
    return message.channel.send(`Volume alterado para **${args[0]/1}/100**`);
  },
};
