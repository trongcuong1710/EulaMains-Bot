const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class CuddleCommand extends Command {
  constructor() {
    super('cuddle', {
      aliases: ['cuddle'],
      ownerOnly: false,
      category: 'Socialism',
      channel: 'guild',
      args: [
        {
          id: 'member',
          type: (message, phrase) => {
            return this.client.util.resolveMember(
              phrase,
              message.guild.members.cache,
              false,
              true
            );
          },
        },
      ],
      cooldown: 30000,
      description: {
        description: 'Cuddle.',
        usage: 'cuddle',
      },
    });
  }

  async exec(message, args) {
    let owo = await neko.sfw.cuddle();
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'BLUE',
          title: `${
            message.author.username || message.author.tag || message.author
          } wants cuddles...`,
          image: { url: owo.url },
        })
      );
    return message.channel.send(
      new MessageEmbed({
        color: 'BLUE',
        title: `${
          message.author.username || message.author.tag || message.author
        } is cuddling ${
          args.member.user.username || args.member.user.tag || args.member
        }`,
        image: { url: owo.url },
      })
    );
  }
}

module.exports = CuddleCommand;
