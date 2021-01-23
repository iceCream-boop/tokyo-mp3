const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "loop",
    description: "Repete toda a lista de músicas",
    usage: "loop",
    aliases: ["lp"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
       if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send({
                embed: {
                    color: "PURPLE",
                    description: `🔁  **|** O loop foi **\`${serverQueue.loop === true ? "habilitado" : "desabilitado"}\`**`
                }
            });
        };
    return sendError("A lista de músicas está vazia", message.channel);
  },
};
