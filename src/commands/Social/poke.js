const { Command } = require('discord-akairo');
const client = require('nekos.life');
const neko = new client();

class PokeCommand extends Command {
  constructor() {
    super('poke', {
      aliases: ['poke'],
      category: 'Social',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Poke a user.',
        usage: 'poke',
      },
    });
  }

  async exec(message) {
    neko.sfw.poke().then((poke) => message.channel.send(poke.url));
  }
}

module.exports = PokeCommand;
