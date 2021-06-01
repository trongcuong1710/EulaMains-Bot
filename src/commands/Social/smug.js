const { Command } = require('discord-akairo');
const { Random } = require('random-discord');
const random = new Random();

class SmugCommand extends Command {
  constructor() {
    super('smug', {
      aliases: ['smug'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends a smug image/gif.',
        usage: 'smug',
      },
    });
  }

  async exec(message) {
    let data = await random.getAnimeImgURL('smug');
    message.channel.send(data);
  }
}

module.exports = SmugCommand;
