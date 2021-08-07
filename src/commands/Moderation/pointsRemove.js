const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class RemovePointsCommand extends Command {
  constructor() {
    super('removepoints', {
      aliases: ['removepoints', 'rp'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      userPermissions: 'ADMINISTRATOR',
      clientPermissions: 'ADMINISTRATOR',
      args: [
        {
          id: 'points',
          type: 'integer',
          match: 'phrase',
        },
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
          match: 'rest',
        },
      ],
      description: {
        description: 'Remove points from the specified member.',
        usage: 'rp <points> <member>',
      },
    });
  }

  async exec(message, args) {
    if (!args.points)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `You forgot something...\npoints.`,
        })
      );

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
      const filter = { points: fetch.points };
      const update = { points: fetch.points - args.points };

      let updated = await this.client.db.eulaPoints.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
        }
      );
      await message.channel.send(
        new MessageEmbed({
          color: 'BLUE',
          description: `Removed ${args.points} points from **${
            args.member.user.username || args.member.tag || args.member
          }**, they now have **${updated.points}** points!`,
        })
      );
    } else
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `They don't have any points, I can't do anything.`,
        })
      );
  }
}

module.exports = RemovePointsCommand;
