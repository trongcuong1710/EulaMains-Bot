const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const channels = require('../Constants/channels.json');

module.exports = class ErrorHandler {
  /**
   * Logs the error stack to #console-logs channel.
   * @param {Error} e - Error to handle.
   * @param {Discord.User} u - User that encountered this error.
   * @param {Discord.Message} msg - Message that caused the error.
   * @param {Command} cmd - Erroneous command.
   * @returns {Promise} Reports the error and restarts(on heroku).
   */
  static async logImmediately(e, u, msg, cmd) {
    await global.guild.channels.cache.get(channels.errorLogsChannel).send(
      process.env.BOT_OWNER,
      new Discord.MessageEmbed({
        color: 'RED',
        title: `${u.username} | ${u.id} encountered an error!`,
        fields: [
          {
            name: 'Command',
            value: `${cmd.handler.prefix + cmd.id}`,
            inline: true,
          },
          { name: 'Message Link', value: `[Jump](${msg.url})`, inline: true },
        ],
        files: [
          {
            name: 'error.js',
            attachment: Buffer.from(e.stack),
          },
        ],
      })
    );
  }
  /**
   * Interactive error handling, user decides to report it to Zyla or not.
   * @param {Error} e - Error to handle.
   * @param {Discord.User} u - User that encountered this error.
   * @param {Discord.Message} msg - Message that caused the error.
   * @param {Command} cmd - Erroneous command.
   * @returns {Promise} Reports the error and restarts(on heroku).
   */
  static async interactiveErrorHandler(e, u, msg, cmd) {
    await msg.channel
      .send(
        new Discord.MessageEmbed({
          color: 'RED',
          title: `ERROR`,
          description: `Please react with 📨 to report the issue to Zyla!\n**You have 10 seconds to react.**`,
        })
      )
      .then(async (m) => {
        await m.react('📨');
        const filter = (reaction, user) =>
          reaction.emoji.name === '📨' && user.id === msg.author.id;
        const collector = m.createReactionCollector(filter, {
          max: 1,
          time: 10000,
        });
        collector.on('collect', async (r, u) => {
          if (r.emoji.name === '📨')
            return await m
              .edit(
                new Discord.MessageEmbed({
                  color: 'GREEN',
                  description: `Thanks for your help, ${u}!`,
                })
              )
              .then(async () => {
                await m.reactions.removeAll();
                collector.stop();
              });
        });
        collector.on('end', async (collected, reason) => {
          if (reason == 'time') {
            await m.reactions.removeAll();
            return await m.channel.send(
              new Discord.MessageEmbed({
                color: 'RED',
                title: `Timeout!`,
                description: `Time's up, ${msg.author}!\nYou couldn't report in time...\nDon't worry though, you can always report it in our <#856843140534763540> channel!`,
              })
            );
          }
          await ErrorHandler.logImmediately(e, u, msg, cmd);
        });
      });
  }
};
