const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "skipto",
    description: "Pula para música selecionadas",
    usage: "skipto <Número>",
    aliases: ["st"],
  },

  run: async function (client, message, args) {
    if (!args.length || isNaN(args[0]))
      return message.channel.send({
                        embed: {
                            color: "PURPLE",
                            description: `**Use**: \`${client.config.prefix}skipto <Número>\``
                        }
   
                   }).catch(console.error);
        

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("A lista está vazia",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`A fila é somente para ${queue.songs.length} músicas longas`,message.channel).catch(console.error);

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
       return sendError(`:notes: The player has stopped and the queue has been cleared.: ${error}`, message.channel);
      }
    
    queue.textChannel.send({
                        embed: {
                            color: "PURPLE",
                            description: `${message.author} ⏭ Pulando \`${args[0] - 1}\` músicas`
                        }
   
                   }).catch(console.error);
                   message.react("✅")

  },
};
