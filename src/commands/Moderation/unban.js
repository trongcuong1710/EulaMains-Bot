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
      args: [
        {
          id: 'user',
          type: 'string',
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
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
    if (!args.reason) args.reason = 'None Provided';
    if (args.reason.length > 1024) reason = reason.slice(0, 1021) + '...';

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
              description: `**${user.user.tag}** successfully unbanned.`,
            })
          );
        });
    });
  }
}

module.exports = UnbanCommand;
