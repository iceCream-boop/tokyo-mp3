const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "pause",
    description: "Para a música que está sendo tocada",
    usage: "[pause]",
    aliases: ["pause"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
	    try{
      serverQueue.connection.dispatcher.pause()
	  } catch (error) {
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: A música foi parada: ${error}`, message.channel);
      }
      let xd = new MessageEmbed()
      .setDescription("⏸ Pausado")
      .setColor("PURPLE")
      .setTitle("A música foi parada")
      return message.channel.send(xd);
    }
    return sendError("Não há uma música ", message.channel);
  },
};
