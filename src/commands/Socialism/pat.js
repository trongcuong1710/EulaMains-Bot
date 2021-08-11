const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { Random } = require('random-discord');
const random = new Random();

class PatCommand extends Command {
  constructor() {
    super('pat', {
      aliases: ['pat'],
      ownerOnly: false,
      category: 'Socialism',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Pat.',
        usage: 'pat [member]',
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
    let data = await random.getAnimeImgURL('pat');
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          title: `${
            message.author.username || message.author.tag || message.author
          } wants a pat.`,
          image: { url: data },
        })
      );
    return message.channel.send(
      new MessageEmbed({
        color: 'BLUE',
        title: `${
          message.author.username || message.author.tag || message.author
        } is patting ${
          args.member.user.username || args.member.user.tag || args.member
        }`,
        image: { url: data },
      })
    );
  }
}

module.exports = PatCommand;
