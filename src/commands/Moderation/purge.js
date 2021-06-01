const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
class PurgeCommand extends Command {
  constructor() {
    super('purge', {
      aliases: ['purge', 'clear'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      userPermissions: 'MANAGE_MESSAGES',
      description: {
        description: 'Purges the given amount of messages.',
        usage: 'purge <1-100>',
      },
      args: [
        {
          id: 'amount',
          type: 'number',
        },
      ],
    });
  }

  async exec(message, args) {
    const prefix = this.client.commandHandler.prefix;
    if (!args.amount)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <amount>\n       ^^^^^^^^\namount is a required argument that is missing.\`\`\``,
        })
      );

    await message.delete().then(async () => {
      await message.channel.bulkDelete(args.amount).then(async (x) => {
        await message.channel
          .send(
            new MessageEmbed({
              color: 'BLUE',
              description: `Purged ${x.size} messages.`,
            })
          )
          .then(async (msg) => {
            await msg.delete({ timeout: 3000 });
          });
      });
    });
  }
}

module.exports = PurgeCommand;
