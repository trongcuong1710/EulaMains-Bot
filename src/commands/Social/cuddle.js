const { Command } = require('discord-akairo');
const client = require('nekos.life');
const neko = new client();

class CuddleCommand extends Command {
  constructor() {
    super('cuddle', {
      aliases: ['cuddle'],
      category: 'Social',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Cuddle a user.',
        usage: 'cuddle',
      },
    });
  }

  async exec(message) {
    neko.sfw.cuddle().then((cuddle) => message.channel.send(cuddle.url));
  }
}

module.exports = CuddleCommand;
