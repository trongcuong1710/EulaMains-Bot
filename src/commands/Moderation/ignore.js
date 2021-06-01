const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class IgnoreCommand extends Command {
  constructor() {
    super('ignore', {
      aliases: ['ignore'],
      category: 'Moderation',
      channel: 'guild',
      userPermissions: 'MUTE_MEMBERS',
      args: [
        {
          id: 'member',
          type: (message, phrase) => {
            return this.client.util.resolveMember(
              phrase,
              message.guild.members.cache,
              false,
              true
            );
          },
        },
      ],
      description: {
        description: 'Ignores incoming DMs from given member.',
        usage: 'ignore <member>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    const prefix = this.client.commandHandler.prefix;
    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <member>\n        ^^^^^^^^\nmember is a required argument that is missing.\`\`\``,
        })
      );
    if (
      !(await this.client.db.eulaIgnoreList.findOne({
        member_id: args.member,
      }))
    ) {
      await this.client.db.eulaIgnoreList
        .create({
          member_id: args.member,
          ignoredBy: message.author,
        })
        .then(() => {
          this.client.channels.cache.get(channels.dbLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              title: `Member Ignored`,
              fields: [
                {
                  name: 'Member',
                  value: args.member,
                },
                {
                  name: 'Responsible Staff',
                  value: message.member,
                },
                {
                  name: 'Ignored At',
                  value: moment().format('LLLL'),
                },
              ],
            })
          );
          message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.member}'s DMs are now ignored.`,
            })
          );
        });
    } else
      return await this.client.db.eulaIgnoreList
        .findOneAndRemove({
          member_id: args.member,
        })
        .then(() => {
          this.client.channels.cache.get(channels.dbLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'RED',
              title: `Member Unignored`,
              fields: [
                {
                  name: 'Member',
                  value: args.member,
                },
                {
                  name: 'Responsible Staff',
                  value: message.member,
                },
                {
                  name: 'Unignored At',
                  value: moment().format('LLLL'),
                },
              ],
            })
          );
          message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.member}'s DMs are not ignored anymore.`,
            })
          );
        });
  }
}

module.exports = IgnoreCommand;
