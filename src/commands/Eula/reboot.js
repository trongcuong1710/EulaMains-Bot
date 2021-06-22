const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Util = require('../../util/util');

class RebootCommand extends Command {
  constructor() {
    super('reboot', {
      aliases: ['reboot'],
      userPermissions: 'ADMINISTRATOR',
      description: { description: 'Reboots the bot.', usage: 'reboot' },
      ownerOnly: false,
      category: 'Eula',
    });
  }

  async exec(message) {
    await message.channel
      .send(
        new MessageEmbed({
          color: 'BLUE',
          description: `I will have vengeance for this!`,
        })
      )
      .then(async () => {
        await console.log(`Rebooted.`);
        await process.exit(0);
      });
  }
}

module.exports = RebootCommand;
