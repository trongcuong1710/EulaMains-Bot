const { Command } = require('discord-akairo');
const Discord = require('discord.js');
var moment = require('moment');
const channels = require('../../Constants/channels.json');

class WarnCommand extends Command {
  constructor() {
    super('warn', {
      aliases: ['warn', 'w'],
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
          id: 'reason',
          type: 'string',
          match: 'rest',
        },
      ],
      description: {
        description: 'Warn a member.',
        usage: 'warn <member> <reason>',
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
          } <member> [reason]\n      ^^^^^^^^\nmember is a required argument that is missing.\`\`\``,
        })
      );
    if (args.member.id === message.member.id)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You can't warn yourself!`,
        })
      );
    if (args.member === message.guild.me)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You can't warn me!`,
        })
      );
    if (
      args.member.roles.highest.position >=
      message.member.roles.highest.position
    )
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You can't warn someone with an equal or higher role!`,
        })
      );

    let reason = args.reason;
    if (!args.reason) reason = `No Reason Provided.`;

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

    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    moment.locale('en');
    await this.client.db.eulaWarns
      .create({
        warnID: getRandomIntInclusive(1, 10000),
        warnedMember: args.member,
        warnedStaff: message.author,
        reason: reason,
        when: moment().format('LLLL'),
      })
      .then(async (c) => {
        await message.channel
          .send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.member} has now been warned.`,
              fields: [
                {
                  name: `View`,
                  value: `${this.client.commandHandler.prefix}warns ${args.member} ${c.warnID}`,
                  inline: true,
                },
                {
                  name: `Remove`,
                  value: `${this.client.commandHandler.prefix}removewarn ${args.member} ${c.warnID}`,
                  inline: true,
                },
              ],
            })
          )
          .then(async () => {
            await this.client.channels.cache.get(channels.logsChannel).send(
              new Discord.MessageEmbed({
                color: 'GREEN',
                title: `Member Warned`,
                description: `${args.member.user.username} has now been warned.`,
                fields: [
                  {
                    name: `Moderator`,
                    value: message.member,
                    inline: true,
                  },
                  {
                    name: `Member`,
                    value: args.member,
                    inline: true,
                  },
                  {
                    name: `Reason`,
                    value: reason,
                    inline: false,
                  },
                  {
                    name: `Warned At`,
                    value: moment().format('LLLL'),
                    inline: true,
                  },
                ],
              })
            );
            await args.member
              .send(
                new Discord.MessageEmbed({
                  color: 'RED',
                  title: `Warned`,
                  description: `You have been warned.`,
                  fields: [
                    {
                      name: `Moderator`,
                      value: message.member,
                      inline: true,
                    },
                    {
                      name: `Reason`,
                      value: reason,
                      inline: false,
                    },
                    {
                      name: `Warned At`,
                      value: moment().format('LLLL'),
                      inline: true,
                    },
                  ],
                  footer: {
                    text: `If you think you are wrongfully warned, please contact an admin.`,
                  },
                })
              )
              .catch(async (e) => {
                return;
              });
          });
      });
  }
}

module.exports = WarnCommand;