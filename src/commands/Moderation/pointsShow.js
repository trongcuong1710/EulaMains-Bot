const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class ShowPointsCommand extends Command {
  constructor() {
    super('showpoints', {
      aliases: ['showpoints', 'sp'],
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
          match: 'phrase',
        },
      ],
      description: {
        description: 'Show points of a specified member.',
        usage: 'sp <member>',
      },
    });
  }

  async exec(message, args) {
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: 'Who?',
        })
      );

    if (
      await this.client.db.eulaPoints.findOne({
        member_id: args.member.id,
      })
    ) {
      const fetch = await this.client.db.eulaPoints.findOne({
        member_id: args.member.id,
      });

      await message.channel.send(
        new MessageEmbed({
          color: 'BLUE',
          description: `**${
            args.member.user.username || args.member.tag || args.member
          }** currently has **${fetch.points}** points.`,
        })
      );
    } else
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `They don't have any points.`,
        })
      );
  }
}

module.exports = ShowPointsCommand;
