const { Command } = require('discord-akairo');
const { Random } = require('random-discord');
const random = new Random();

class HugCommand extends Command {
  constructor() {
    super('hug', {
      aliases: ['hug'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends a hug image/gif.',
        usage: 'hug',
      },
    });
  }

  async exec(message) {
    let data = await random.getAnimeImgURL('hug');
    message.channel.send(data);
  }
}

module.exports = HugCommand;
