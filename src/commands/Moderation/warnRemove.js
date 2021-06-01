const { Command } = require('discord-akairo');
const Discord = require('discord.js');
var moment = require('moment');
const channels = require('../../Constants/channels.json');

class RemoveWarnCommand extends Command {
  constructor() {
    super('removewarn', {
      aliases: ['removewarn', 'rw'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
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
        {
          id: 'warnID',
          type: 'string',
        },
      ],
      description: {
        description: "Remove a member's warn.",
        usage: 'removewarn <member> <warn ID>',
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
          } <member> <warnID>\n            ^^^^^^^^\nmember is a required argument that is missing.\`\`\``,
        })
      );
    if (!args.warnID)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <member> <warnID>\n                     ^^^^^^^^\nwarnID is a required argument that is missing.\`\`\``,
        })
      );

    const permRoles = [
      '821556056282103819', // 500's owner role
      '808507839382552598', // Admin
      '808515071772459018', // Mod
      '830270184479522857', // Zyla
    ];
    var i;
    for (i = 0; i <= permRoles.length; i++) {
      if (
        message.member.roles.cache
          .map((x) => x.id)
          .filter((x) => permRoles.includes(x)).length === 0
      )
        return message.channel.send(
          new MessageEmbed({
            color: 'RED',
            description: "You can't do that with the permissions you have.",
          })
        );
    }

    const warnReasonWas = await this.client.db.eulaWarns.find({
      warnID: args.warnID,
    });
    await this.client.db.eulaWarns
      .deleteOne({ warnID: args.warnID })
      .then(async (c) => {
        await message.channel.send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            description: `Removed **${args.warnID}** from ${args.member}'s warns.`,
          })
        );
        await this.client.channels.cache
          .get(channels.logsChannel)
          .send(
            new Discord.MessageEmbed({
              color: 'RED',
              title: `Member Warn Removed`,
              description: `Removed ${args.warnID} from ${args.member.user.username}'s warns.`,
              fields: [
                { name: `Moderator`, value: message.member, inline: true },
                { name: `Member`, value: args.member, inline: true },
                {
                  name: `Warn Reason Was`,
                  value: warnReasonWas.map((x) => x.reason).join('\n'),
                  inline: false,
                },
                {
                  name: `Removed Warn At`,
                  value: moment().format('LLLL'),
                  inline: true,
                },
              ],
            })
          )
          .then(async (msg) => {
            await args.member
              .send(
                new Discord.MessageEmbed({
                  color: 'GREEN',
                  title: `Warn Removed`,
                  description: `One of your warns have been removed in ${message.guild.name}.`,
                  fields: [
                    {
                      name: `Moderator`,
                      value: message.member,
                      inline: true,
                    },
                    {
                      name: `Warn Reason Was`,
                      value: warnReasonWas.reason,
                      inline: false,
                    },
                    {
                      name: `Removed Warned At`,
                      value: moment().format('LLLL'),
                      inline: true,
                    },
                  ],
                })
              )
              .catch(async (e) => {
                return;
              });
          });
      });
  }
}

module.exports = RemoveWarnCommand;
