const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class OwOifyCommand extends Command {
  constructor() {
    super('owoify', {
      aliases: ['owoify'],
      ownerOnly: false,
      category: 'Socialism',
      channel: 'guild',
      args: [{ id: 'message', type: 'string', match: 'rest' }],
      cooldown: 30000,
      description: {
        description: 'OwO',
        usage: 'owoify <message>',
      },
    });
  }

  async exec(message, args) {
    let owo = await neko.sfw.OwOify({ text: args.message });
    message.channel.send(owo.owo);
  }
}

module.exports = OwOifyCommand;
