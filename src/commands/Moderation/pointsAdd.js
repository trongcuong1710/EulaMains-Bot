const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class AddPointsCommand extends Command {
  constructor() {
    super('addpoints', {
      aliases: ['addpoints', 'ap'],
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
        description: 'Add points to the specified member.',
        usage: 'ap <points> <member>',
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
      !(await this.client.db.eulaPoints.findOne({
        member_id: args.member.id,
      }))
    ) {
      await this.client.db.eulaPoints.create({
        member_id: args.member.id,
        points: args.points,
      });
      await message.channel.send(
        new MessageEmbed({
          color: 'BLUE',
          description: `Added **${args.points}** points to **${
            args.member.user.username || args.member.tag || args.member
          }**!`,
          timestamp: new Date(),
        })
      );
    } else {
      await this.client.db.eulaPoints
        .findOne({ member_id: args.member.id })
        .then(async (data) => {
          const filter = { points: data.points };
          const update = { points: data.points + args.points };
          let updated = await this.client.db.eulaPoints.findOneAndUpdate(
            filter,
            update,
            {
              new: true,
            }
          );
          message.channel.send(
            new MessageEmbed({
              color: 'BLUE',
              description: `Added ${args.points} points to **${
                args.member.user.username || args.member.tag || args.member
              }**, they now have **${updated.points}** points!`,
            })
          );
        });
    }
  }
}

module.exports = AddPointsCommand;
