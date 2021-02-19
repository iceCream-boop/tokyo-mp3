const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "nowplaying",
    description: "Mostra a música que está tocando",
    usage: "[nowplaying ou np]",
    aliases: ["np"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Não há uma música tocando", message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Tocando agora")
      .setImage(song.img)
      .setColor("#FF00E5")
      .addField("Música",`[\ ${song.title}\](${song.url})`, true)
      //.addField("Duração", song.duration, true)
      .addField("Adicionada por",`<@${message.author.id}>`, true)
    return message.channel.send(thing)
  },
};