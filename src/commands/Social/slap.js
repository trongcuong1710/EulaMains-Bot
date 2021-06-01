const { Command } = require('discord-akairo');
const { Random } = require('random-discord');
const random = new Random();

class SlapCommand extends Command {
  constructor() {
    super('slap', {
      aliases: ['slap'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends a slap image/gif.',
        usage: 'slap',
      },
    });
  }

  async exec(message) {
    let data = await random.getAnimeImgURL('slap');
    message.channel.send(data);
  }
}

module.exports = SlapCommand;
