const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class WoofCommand extends Command {
  constructor() {
    super('woof', {
      aliases: ['woof'],
      ownerOnly: false,
      category: 'Socialism',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'DOG DOG DOG',
        usage: 'woof',
      },
    });
  }

  async exec(message) {
    let owo = await neko.sfw.woof();
    message.channel.send(
      new MessageEmbed({ color: 'BLUE', image: { url: owo.url } })
    );
  }
}

module.exports = WoofCommand;
