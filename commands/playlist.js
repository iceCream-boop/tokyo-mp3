const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
var ytpl = require("ytpl");
const sendError = require("../util/error");
const fs = require("fs");

module.exports = {
    info: {
        name: "playlist",
        description: "Adiciona todas as músicas de uma playlist",
        usage: "<Url da playlist | Nome da playlist>",
        aliases: ["pl"],
    },

    run: async function (client, message, args) {
        const channel = message.member.voice.channel;
        if (!channel) return sendError("Você precisa está conectado a um canal de voz", message.channel);
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
        var searchString = args.join(" ");
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return sendError("Eu não posso conectar ao canal/nVerifique se eu tenho a permissão de \`conectar\`", message.channel);
        if (!permissions.has("SPEAK")) return sendError("Eu não posso falar no canal/nVerifique se eu tenho a permissão de \`falar\`", message.channel);

        if (!searchString || !url) return sendError("Digite o nome ou o link da playlist", message.channel);
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            try {
                const playlist = await ytpl(url.split("list=")[1]);
                if (!playlist) return sendError("/`://` Playlist não encontrada", message.channel);
                const videos = await playlist.items;
                for (const video of videos) {
                  await handleVideo(video, message, channel, true);
                }
               return message.channel.send(`✅  **|** A playlist\ ${videos[0].title}\ foi adicionada a fila`);
            } catch (error) {
                console.error(error);
                return sendError("Playlist não encontrada", message.channel).catch(console.error);
            }
        } else {
            try {
                var searched = await yts.search(searchString);

                if (searched.playlists.length === 0) return sendError("Não consegui encontrar a playlist", message.channel);
                var songInfo = searched.playlists[0];
                let listurl = songInfo.listId;
                const playlist = await ytpl(listurl);
                const videos = await playlist.items;
                for (const video of videos) {
                   await handleVideo(video, message, channel, true);
                }
                let thing = new MessageEmbed()
                    .setAuthor("Playlist adicionada a fila")
                    .setThumbnail(songInfo.thumbnail)
                    .setColor("#FF00E5")
                    .setDescription(`A playlist ${songInfo.title}\ adicionou ${songInfo.videoCount} músicas a fila`);
                return message.channel.send(thing);
            } catch (error) {
                return; //sendError("An unexpected error has occurred", message.channel).catch(console.error);
            }
        }

        async function handleVideo(video, message, channel, playlist = false) {
            const serverQueue = message.client.queue.get(message.guild.id);
            const song = {
                id: video.id,
                title: Util.escapeMarkdown(video.title),
                views: video.views ? video.views : "-",
                ago: video.ago ? video.ago : "-",
                duration: video.duration,
                url: `https://www.youtube.com/watch?v=${video.id}`,
                img: video.thumbnail,
                req: message.author,
            };
            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: message.channel,
                    voiceChannel: channel,
                    connection: null,
                    songs: [],
                    volume: 80,
                    playing: true,
                    loop: false,
                };
                message.client.queue.set(message.guild.id, queueConstruct);
                queueConstruct.songs.push(song);

                try {
                    var connection = await channel.join();
                    queueConstruct.connection = connection;
                    play(message.guild, queueConstruct.songs[0]);
                } catch (error) {
                    console.error(`${error}`);
                    message.client.queue.delete(message.guild.id);
                    return; //sendError(`${error}`, message.channel);
                }
            } else {
                serverQueue.songs.push(song);
                if (playlist) return;
                let thing = new MessageEmbed()
                    .setAuthor("Música adicionada a fila")
                    .setImage(song.img)
                    .setColor("#FF00E5")
                    .addField("Música",`[\ ${song.Title}\](${song.url})`,true)
                    //.addField("Duração", song.duration, true)
                    .addField("Adicionada por",`<@${message.author.id}>`, true)
                return message.channel.send(thing);
            }
            return;
        }

        async function play(guild, song) {
            const serverQueue = message.client.queue.get(message.guild.id);
            if (!song) {
                sendError(
                    "",message.channel
                );
                message.guild.me.voice.channel.leave(); //A mesma coisa do comando de play.js
                message.client.queue.delete(message.guild.id);
                return;
            }
            let stream = null;
            if (song.url.includes("youtube.com")) {
                stream = await ytdl(song.url);
                stream.on("error", function (er) {
                    if (er) {
                        if (serverQueue) {
                            serverQueue.songs.shift();
                            play(guild, serverQueue.songs[0]);
                            return; //sendError(`An unexpected error has occurred.\nPossible type \`${er}\``, message.channel);
                        }
                    }
                });
            }

            serverQueue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
            const dispatcher = serverQueue.connection.play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25, type: "opus" })).on("finish", () => {
                const shiffed = serverQueue.songs.shift();
                if (serverQueue.loop === true) {
                    serverQueue.songs.push(shiffed);
                }
                play(guild, serverQueue.songs[0]);
            });

            dispatcher.setVolume(serverQueue.volume / 100);
            let thing = new MessageEmbed()
                .setAuthor("Tocando agora")
                .setImage(song.img)
                .setColor("#FF00E5")
                .addField("Música",`[\ ${song.title}\](${song.url})`, true)
                //.addField("Duração", song.duration, true)
                .addField("Adicionada por",`<@${message.author.id}>`, true)
            serverQueue.textChannel.send(thing);
        }
    },
};
