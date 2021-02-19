const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "lyrics",
    description: "Mostra a letra da música que está tocando",
    usage: "[lyrics, letra ou ly]",
    aliases: ["ly, letra"],
  },

  run: async function (client, message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("Não há uma música tocando",message.channel).catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `Não foi encontrada uma letra para ${queue.songs[0].title}.`;
    } catch (error) {
      lyrics = `Não foi encontrada uma letra para ${queue.songs[0].title}.`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setAuthor(`Letra de ${queue.songs[0].title}`)
      .setThumbnail(queue.songs[0].img)
      .setColor("#FF00E5")
      .setDescription(lyrics)
      //.setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  },
};
