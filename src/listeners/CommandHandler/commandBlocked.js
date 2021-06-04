const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class CommandBlockedListener extends Listener {
  constructor() {
    super('commandBlocked', {
      emitter: 'commandHandler',
      event: 'commandBlocked',
      category: 'CommandHandler',
    });
  }

  async exec(message, command, reason) {
    const prefix = this.client.commandHandler.prefix;
    if (reason == 'dm' || reason == 'guild')
      return await message.channel.send(
        message.member,
        new MessageEmbed({
          color: 'RED',
          description: `\`${prefix + command}\` is not usable here.`,
          fields: [
            {
              name: `Reason`,
              value: `This command is only usable in ${reason}`,
            },
          ],
        })
      );
    return message.channel.send(
      new MessageEmbed({
        color: 'RED',
        description: `\`${prefix + command}\` is not usable by everyone.`,
        fields: [{ name: `Reason`, value: `This command is ${reason} only.` }],
      })
    );
  }
}

module.exports = CommandBlockedListener;
