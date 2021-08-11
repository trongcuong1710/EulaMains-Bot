const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const channels = require('../../Constants/channels.json');
const roles = require('../../Constants/roles.json');

class UnmuteCommand extends Command {
  constructor() {
    super('unmute', {
      aliases: ['unmute'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      userPermissions: 'MUTE_MEMBERS',
      description: {
        description: 'Unmute a member.',
        usage: 'unmute <member> <reason>',
      },
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
    });
  }

  async exec(message, args) {
    const muteRole = message.guild.roles.cache.get(roles.muteRole);
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `Please specify a member.`,
        })
      );

    await args.member.roles.remove(muteRole).then(async () => {
      await this.client.db.eulaMutes.deleteOne({
        member_id: args.member.id,
      });
      await message.channel.send(
        new MessageEmbed({
          color: 'GREEN',
          description: `**${args.member}** has now been unmuted.`,
        })
      );
      await this.client.channels.cache.get(channels.punishmentLogsChannel).send(
        new MessageEmbed({
          color: 'GREEN',
          title: `Unmuted`,
          description: `**${args.member}** has been unmuted.`,
        })
      );
      args.member
        .send(
          new MessageEmbed({
            color: 'GREEN',
            title: `You have been unmuted in ${global.guild.name}.`,
            description: `\n**Responsible Staff**: ${
              message.author.tag || message.author.username || message.author
            }`,
            timestamp: new Date(),
          })
        )
        .catch((_) => {
          return;
        });
    });
  }
}

module.exports = UnmuteCommand;
