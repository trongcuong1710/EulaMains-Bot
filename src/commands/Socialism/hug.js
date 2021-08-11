const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { Random } = require('random-discord');
const random = new Random();

class HugCommand extends Command {
  constructor() {
    super('hug', {
      aliases: ['hug'],
      ownerOnly: false,
      category: 'Socialism',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Hug.',
        usage: 'hug [member]',
      },
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
    });
  }

  async exec(message, args) {
    let data = await random.getAnimeImgURL('hug');
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `Please mention a member!`,
        })
      );
    return message.channel.send(
      new MessageEmbed({
        color: 'BLUE',
        title: `${
          message.author.username || message.author.tag || message.author
        } is giving ${
          args.member.user.username || args.member.user.tag || args.member
        } a hug.`,
        image: { url: data },
      })
    );
  }
}

module.exports = HugCommand;
