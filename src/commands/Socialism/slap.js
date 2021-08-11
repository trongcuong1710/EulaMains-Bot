const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { Random } = require('random-discord');
const random = new Random();

class SlapCommand extends Command {
  constructor() {
    super('slap', {
      aliases: ['slap'],
      ownerOnly: false,
      category: 'Socialism',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Slap.',
        usage: 'slap <member>',
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
    let data = await random.getAnimeImgURL('slap');
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
        } is slapping ${
          args.member.user.username || args.member.user.tag || args.member
        }`,
        image: { url: data },
      })
    );
  }
}

module.exports = SlapCommand;
