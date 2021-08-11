const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class BakaCommand extends Command {
  constructor() {
    super('baka', {
      aliases: ['baka'],
      ownerOnly: false,
      category: 'Socialism',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Baka.',
        usage: 'baka',
      },
    });
  }

  async exec(message) {
    let owo = await neko.sfw.baka();
    message.channel.send(
      new MessageEmbed({ color: 'BLUE', image: { url: owo.url } })
    );
  }
}

module.exports = BakaCommand;
