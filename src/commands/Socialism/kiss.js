const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { Random } = require('random-discord');
const random = new Random();

class KissCommand extends Command {
  constructor() {
    super('kiss', {
      aliases: ['kiss'],
      ownerOnly: false,
      category: 'Socialism',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Kiss.',
        usage: 'kiss [member]',
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
    let data = await random.getAnimeImgURL('kiss');
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          title: `${
            message.author.username || message.author.tag || message.author
          } wants some kisses...`,
          image: { url: data },
        })
      );
    return message.channel.send(
      new MessageEmbed({
        color: 'BLUE',
        title: `${
          message.author.username || message.author.tag || message.author
        } kissed ${
          args.member.user.username || args.member.user.tag || args.member
        }.`,
        image: { url: data },
      })
    );
  }
}

module.exports = KissCommand;
