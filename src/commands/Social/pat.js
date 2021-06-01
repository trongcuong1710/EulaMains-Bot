const { Command } = require('discord-akairo');
const { Random } = require('random-discord');
const random = new Random();

class PatCommand extends Command {
  constructor() {
    super('pat', {
      aliases: ['pat'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends a pat image/gif.',
        usage: 'pat',
      },
    });
  }

  async exec(message) {
    let data = await random.getAnimeImgURL('pat');
    message.channel.send(data);
  }
}

module.exports = PatCommand;
