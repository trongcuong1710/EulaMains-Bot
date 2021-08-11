const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class LizardCommand extends Command {
  constructor() {
    super('lizard', {
      aliases: ['lizard'],
      ownerOnly: false,
      category: 'Socialism',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Lizard.',
        usage: 'lizard',
      },
    });
  }

  async exec(message) {
    let owo = await neko.sfw.lizard();
    message.channel.send(
      new MessageEmbed({ color: 'BLUE', image: { url: owo.url } })
    );
  }
}

module.exports = LizardCommand;
