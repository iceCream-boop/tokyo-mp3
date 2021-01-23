const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "nowplaying",
    description: "Mostra a música que está sendo tocada",
    usage: "",
    aliases: ["np"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Não há uma música tocando agora", message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Tocando agora")
      .setThumbnail(song.img)
      .setColor("PURPLE")
      .addField("Nome", song.title, true)
      .addField("Duração", song.duration, true)
      .addField("Adicionado por", song.req.tag, true)
      .setFooter(`${song.views} Visualizações | ${song.ago}`)
    return message.channel.send(thing)
  },
};
