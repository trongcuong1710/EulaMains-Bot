const { Command } = require('discord-akairo');
const { Random } = require('random-discord');
const random = new Random();

class CryCommand extends Command {
  constructor() {
    super('cry', {
      aliases: ['cry'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Cry.',
        usage: 'cry',
      },
    });
  }

  async exec(message) {
    let data = await random.getAnimeImgURL('cry');
    message.channel.send(data);
  }
}

module.exports = CryCommand;
