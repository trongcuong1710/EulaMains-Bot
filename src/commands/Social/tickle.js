const { Command } = require('discord-akairo');
const client = require('nekos.life');
const neko = new client();

class TickleCommand extends Command {
  constructor() {
    super('tickle', {
      aliases: ['tickle'],
      category: 'Social',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Tickle a user.',
        usage: 'tickle',
      },
    });
  }

  async exec(message) {
    neko.sfw.tickle().then((tickle) => message.channel.send(tickle.url));
  }
}

module.exports = TickleCommand;
