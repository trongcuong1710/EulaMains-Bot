const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class BlacklistCommand extends Command {
  constructor() {
    super('blacklist', {
      aliases: ['blacklist', 'bl'],
      category: 'Moderation',
      channel: 'guild',
      args: [
        {
          id: 'channel',
          type: (message, phrase) => {
            return this.client.util.resolveChannel(
              phrase,
              message.guild.channels.cache,
              false,
              true
            );
          },
        },
      ],
      description: {
        description: 'Disables/Enables eula in a given channel.',
        usage: 'blacklist <channel>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    const roles = [
      '821556056282103819', // 500's owner role
      '808507839382552598', // Admin
      '808515071772459018', // Mod
      '830270184479522857', // Zyla
    ];
    var i;
    for (i = 0; i <= roles.length; i++) {
      if (
        message.member.roles.cache
          .map((x) => x.id)
          .filter((x) => roles.includes(x)).length === 0
      )
        return await message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: "You can't do that with the permissions you have.",
          })
        );
    }

    const prefix = this.client.commandHandler.prefix;

    if (!args.channel)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <channel>\n           ^^^^^^^^^\nchannel is a required argument that is missing.\`\`\``,
        })
      );

    if (
      !(await this.client.db.eulaBlacklists.findOne({
        channel_id: args.channel,
      }))
    ) {
      await this.client.db.eulaBlacklists
        .create({
          channel_id: args.channel,
          blacklistedBy: message.author,
        })
        .then(async () => {
          message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.channel} is now blacklisted.`,
              footer: { text: `Use the command again to unblacklist.` },
            })
          );
          this.client.channels.cache.get(channels.dbLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              title: `Channel Blacklist`,
              fields: [
                {
                  name: 'Channel',
                  value: args.channel,
                },
                {
                  name: 'Responsible Staff',
                  value: message.member,
                },
                {
                  name: 'Blacklisted At',
                  value: moment().format('LLLL'),
                },
              ],
            })
          );
        });
    } else
      return await this.client.db.eulaBlacklists
        .findOneAndRemove({
          channel_id: args.channel,
        })
        .then(async () => {
          await message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.channel} is not blacklisted anymore.`,
              footer: { text: `Use the command again to blacklist.` },
            })
          );
          return await this.client.channels.cache
            .get(channels.dbLogsChannel)
            .send(
              new Discord.MessageEmbed({
                color: 'RED',
                title: `Channel Unblacklist`,
                fields: [
                  {
                    name: 'Channel',
                    value: args.channel,
                  },
                  {
                    name: 'Responsible Staff',
                    value: message.member,
                  },
                  {
                    name: 'Unblacklisted At',
                    value: moment().format('LLLL'),
                  },
                ],
              })
            );
        });
  }
}

module.exports = BlacklistCommand;
