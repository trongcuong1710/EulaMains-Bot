const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

class PokeCommand extends Command {
  constructor() {
    super('poke', {
      aliases: ['poke'],
      ownerOnly: false,
      category: 'Socialism',
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Poke.',
        usage: 'poke <member>',
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
    let data = await neko.sfw.poke();
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `Please, mention someone.`,
        })
      );
    return message.channel.send(
      new MessageEmbed({
        color: 'BLUE',
        title: `${
          message.author.username || message.author.tag || message.author
        } is poking ${
          args.member.user.username || args.member.user.tag || args.member
        }.`,
        image: { url: data.url },
      })
    );
  }
}

module.exports = PokeCommand;
