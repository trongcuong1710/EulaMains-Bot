const { Command } = require('discord-akairo');
const { Random } = require('random-discord');
const random = new Random();

class PunchCommand extends Command {
  constructor() {
    super('punch', {
      aliases: ['punch'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends a punch image/gif.',
        usage: 'punch',
      },
    });
  }

  async exec(message) {
    let data = await random.getAnimeImgURL('punch');
    message.channel.send(data);
  }
}

module.exports = PunchCommand;
