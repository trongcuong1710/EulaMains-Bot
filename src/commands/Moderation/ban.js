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
        description: 'Ban the specified member in the guild.',
        usage: 'ban <member> [reason]',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    const prefix = this.client.commandHandler.prefix;
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <member> [reason]\n     ^^^^^^^^\nmember is a required argument that is missing.\n\nKeep in mind users that are not in the server can not be banned, yet.\`\`\``,
        })
      );

    if (!args.reason) args.reason = 'None Provided';
    if (args.reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (
      args.member.roles.highest.position >=
      message.member.roles.highest.position
    )
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `No.`,
        })
      );

    await args.member.ban({ reason: args.reason }).then(() => {
      message.channel.send(
        new MessageEmbed({
          color: 'GREEN',
          description: `Banned **${args.member.tag}**.`,
          footer: { text: `ID: ${args.member.id}` },
        })
      );
    });
  }
}

module.exports = BanCommand;
