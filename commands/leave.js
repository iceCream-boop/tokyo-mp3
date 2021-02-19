const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    info: {
        name: "leave",
        aliases: ["sair", "desconectar"],
        description: "Desconecta o bot do canal",
        usage: "[leave, sair ou desconectar]",
    },

    run: async function (client, message, args) {
        let channel = message.member.voice.channel;
        if (!channel) return sendError("Você precisa está conectado a um canal de voz", message.channel);
        if (!message.guild.me.voice.channel) return sendError("Eu não estou conectado a um canal", message.channel);

        try {
            await message.guild.me.voice.channel.leave();
        } catch (error) {
            await message.guild.me.voice.kick(message.guild.me.id);
            return sendError("Saindo do canal de voz...", message.channel);
        }
        return message.channel.send("Desconectado do canal de voz");
    },
};
