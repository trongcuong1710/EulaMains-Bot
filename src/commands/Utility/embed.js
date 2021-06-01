const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class EmbedCommand extends Command {
  constructor() {
    super('embed', {
      aliases: ['embed'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      description: {
        description: 'Takes json input and returns embedded message.',
        usage: 'embed <JSON>',
      },
    });
  }

  async exec(message, args) {
    const permRoles = [
      '830700055539089457', // Admin
      '830700055539089456', // Mods
      '831001258806345728', // 76th Funeral Director (Zyla)
    ];
    var i;
    for (i = 0; i <= permRoles.length; i++) {
      if (
        message.member.roles.cache
          .map((x) => x.id)
          .filter((x) => permRoles.includes(x)).length === 0
      )
        return message.channel.send(
          new Discord.MessageEmbed().setDescription(
            "You can't do that with the permissions you have."
          )
        );
    }
    try {
      message.channel.send(
        new Discord.MessageEmbed(
          JSON.parse(message.content.split(' ').splice(1).join(' '))
        )
      );
    } catch (e) {
      await message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Improper input.`,
        })
      );
    }
  }
}

module.exports = EmbedCommand;
