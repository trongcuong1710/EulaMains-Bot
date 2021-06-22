const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

class BanCommand extends Command {
  constructor() {
    super('ban', {
      aliases: ['ban', 'b'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      clientPermissions: 'BAN_MEMBERS',
      userPermissions: 'BAN_MEMBERS',
      args: [
        {
          id: 'member',
          type: 'string',
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
        },
      ],
      description: {
        description: 'Ban the specified user.',
        usage: 'ban <user> [reason]',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');

    if (!args.reason) args.reason = 'None Provided';
    if (args.reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    const member = await global.guild.members.cache.get(args.member);
    if (member)
      if (
        member.roles.highest.position >= message.member.roles.highest.position
      )
        return message.channel.send(
          new MessageEmbed({
            color: 'RED',
            description: `No.`,
          })
        );

    await global.guild.members
      .ban(args.member, { reason: args.reason })
      .then((user) =>
        message.channel.send(
          new MessageEmbed({
            color: 'BLUE',
            description: `Banned ${user.tag || user.id || user}.`,
          })
        )
      )
      .catch(async (e) => {
        await message.channel.send(
          new MessageEmbed({ color: 'RED', description: 'Where user?' })
        );
      });
  }
}

module.exports = BanCommand;
