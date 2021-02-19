const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "loop",
    description: "Repete todas as músicas da fila",
    usage: "[loop ou l]",
    aliases: ["l"],
  },

  run: async function (client, message, args) {
    let channel = message.member.voice.channel;
       if (!channel) return sendError("Você precisa está conectado a um canal de voz", message.channel);

    const serverQueue = message.client.queue.get(message.guild.id);
       if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send(`🔁 **| Loop\ ${serverQueue.loop === true ? "habilitado" : "desabilitado"}\**`);
        };
    return sendError("Não há uma música tocando", message.channel);
  },
};
