const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { Random } = require('random-discord');
const random = new Random();

class CryCommand extends Command {
  constructor() {
    super('cry', {
      aliases: ['cry'],
      ownerOnly: false,
      category: 'Socialism',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Cry.',
        usage: 'cry',
      },
    });
  }

  async exec(message, args) {
    let data = await random.getAnimeImgURL('cry');
    return message.channel.send(
      new MessageEmbed({
        color: 'RED',
        title: `${
          message.author.username || message.author.tag || message.author
        } is crying, how sad.`,
        image: { url: data },
      })
    );
  }
}

module.exports = CryCommand;
