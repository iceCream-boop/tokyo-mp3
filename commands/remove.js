const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "remove",
    description: "Remove uma música da lista",
    usage: "<número>",
    aliases: ["rm"],
  },

  run: async function (client, message, args) {
  let channel = message.member.voice.channel;
    if (!channel) return sendError("Você precisa está conectado a um canal de voz", message.channel);
  const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("Não há uma lista",message.channel).catch(console.error);
    if (!args.length) return sendError("Digite o número da música para remover");
    if (isNaN(args[0])) return sendError("Digite o número da música para remover");
    if (queue.songs.length == 1) return sendError("A lista está vazia",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`Há somente ${queue.songs.length} músicas na lista`,message.channel).catch(console.error);
try{
    const song = queue.songs.splice(args[0] - 1, 1); 
    sendError(`**\`${song[0].title}\`** foi removido da lista`,queue.textChannel).catch(console.error);
                   //message.react("✅")
} catch (error) {
        return; //sendError(`:notes: An unexpected error occurred.\nPossible type: ${error}`, message.channel);
      }
  },
};
