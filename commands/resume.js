const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "resume",
    description: "Reproduz a música que foi parada",
    usage: "",
    aliases: ["reproduzir"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
   return message.channel.send(":arrow_forward: **| Reproduzindo a música**");
    }
    return sendError("Não há uma música tocando", message.channel);
  },
};
