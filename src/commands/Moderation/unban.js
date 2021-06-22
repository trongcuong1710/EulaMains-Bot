const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

class UnbanCommand extends Command {
  constructor() {
    super('unban', {
      aliases: ['unban', 'ub'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      userPermissions: 'BAN_MEMBERS',
      clientPermissions: 'BAN_MEMBERS',
      args: [
        {
          id: 'user',
          type: 'string',
        },
      ],
      description: {
        description: 'Unbans the member. **Use IDs Only**',
        usage: 'unban <user> [reason]',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    const prefix = this.client.commandHandler.prefix;
    if (!args.user)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <user> [reason]\n       ^^^^^^\nuser is a required argument that is missing.\`\`\``,
        })
      );

    await message.guild.fetchBans().then(async (bans) => {
      const isBanned = await bans.some((u) => u.user.id === args.user);
      const user = await bans.find((u) => u.user.id === args.user);
      const member = await this.client.users.cache.get(args.user);

      if (!isBanned)
        return await message.channel.send(
          new MessageEmbed({
            color: 'RED',
            description: `**${member.tag}** is not banned tho.`,
          })
        );
      await message.guild.members
        .unban(user.user.id, args.reason)
        .then(async () => {
          return await message.channel.send(
            new MessageEmbed({
              color: 'BLUE',
              description: `${
                user.user.tag || user.user.id || user.user
              } successfully unbanned.`,
            })
          );
        });
    });
  }
}

module.exports = UnbanCommand;
