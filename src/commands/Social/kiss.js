const { Command } = require('discord-akairo');
const { Random } = require('random-discord');
const random = new Random();

class KissCommand extends Command {
  constructor() {
    super('kiss', {
      aliases: ['kiss'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends a kiss image/gif.',
        usage: 'kiss',
      },
    });
  }

  async exec(message) {
    let data = await random.getAnimeImgURL('kiss');
    message.channel.send(data);
  }
}

module.exports = KissCommand;
