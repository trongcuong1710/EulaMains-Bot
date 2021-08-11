const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class MeowCommand extends Command {
  constructor() {
    super('meow', {
      aliases: ['meow'],
      ownerOnly: false,
      category: 'Socialism',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'CAT CAT CAT',
        usage: 'meow',
      },
    });
  }

  async exec(message) {
    let owo = await neko.sfw.meow();
    message.channel.send(
      new MessageEmbed({ color: 'BLUE', image: { url: owo.url } })
    );
  }
}

module.exports = MeowCommand;
