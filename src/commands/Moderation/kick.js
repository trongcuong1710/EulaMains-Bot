const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

class KickCommand extends Command {
  constructor() {
    super('kick', {
      aliases: ['kick', 'k'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      userPermissions: 'KICK_MEMBERS',
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
        description: 'Kicks the member.',
        usage: 'kick <member> [reason]',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `Please specify a member.`,
        })
      );

    if (args.member.id === message.member.id)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `You can't kick yourself!`,
        })
      );

    if (args.member === message.guild.me)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `You can't kick me!`,
        })
      );

    if (
      args.member.roles.highest.position >=
      message.member.roles.highest.position
    )
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `You can't warn someone with an equal or higher role!`,
        })
      );

    if (!args.reason) args.reason = 'None Provided';
    if (args.reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await args.member.kick(args.reason).then(async () => {
      message.channel.send(
        new MessageEmbed({
          color: 'GREEN',
          description: `Kicked **${args.member.user.tag}**.`,
          footer: { text: `ID: ${args.member.id}` },
        })
      );
    });
  }
}

module.exports = KickCommand;
