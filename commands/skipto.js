const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "skipto",
    description: "Toca a música selecionada",
    usage: "<número>",
    aliases: ["st"],
  },

  run: async function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel) return sendError("Você precisa está conectado a um canal de voz", message.channel);

    if (!args.length || isNaN(args[0]))
      return message.channel.send("Digite o nome da música para pular").catch(console.error);
        

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("Não há uma lista",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`Há somente ${queue.songs.length} músicas na lista`,message.channel).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
     try{
    queue.connection.dispatcher.end();
      }catch (error) {
        queue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
       return; //sendError(`${error}`, message.channel);
      }
    
    queue.textChannel.send(`⏩ **| Pulando ${args[0] - 1} músicas**`).catch(console.error);
                   message.react("✅")

  },
};
