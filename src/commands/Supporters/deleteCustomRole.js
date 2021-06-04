const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class DeleteCustomRoleCommand extends Command {
  constructor() {
    super('deletecustomrole', {
      aliases: ['deletecustomrole', 'dcr', 'delcusrole'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      description: {
        description:
          'Create a custom role for yourself if you are a patreon booster.',
        usage: 'myrole <role name>',
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
        {
          id: 'reason',
          type: 'string',
          match: 'text',
        },
      ],
    });
  }

  async exec(message, args) {
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <member> [reason]\n     ^^^^^^^^\nmember is a required argument that is missing.\`\`\``,
        })
      );
    if (!args.reason) args.reason = '`None Provided`';

    const customRoles = await this.client.db.eulaCustomRoles.find({
      roleOwner: args.member.id,
    });
    const role = message.guild.roles.cache.get(
      customRoles.map((x) => x.roleID).join('\n')
    );
    await this.client.db.eulaCustomRoles
      .deleteOne({ roleID: role.id })
      .then(async () => {
        if (!role) return;

        await role.delete(args.reason).then(async () => {
          await message.channel.send(
            new MessageEmbed({
              color: 'GREEN',
              description: `Successfully deleted the role!`,
            })
          );
        });
      });
  }
}

module.exports = DeleteCustomRoleCommand;
