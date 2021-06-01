const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class SayCommand extends Command {
  constructor() {
    super('say', {
      aliases: ['say'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      args: [
        {
          id: 'channel',
          type: (message, phrase) => {
            return this.client.util.resolveChannel(
              phrase,
              message.guild.channels.cache,
              false,
              true
            );
          },
        },
        {
          id: 'message',
          type: 'string',
          match: 'rest',
        },
      ],
      clientPermissions: 'MANAGE_MESSAGES',
      description: {
        description:
          'Resends the message either to current channel or given channel.',
        usage: 'say <channel> <message>',
      },
    });
  }

  async exec(message, args) {
    if (!args.channel)
      return message.channel.send(
        new Discord.MessageEmbed({
          description: `Please supply a channel to send the message.`,
        })
      );
    if (!args.message)
      return message.channel.send(
        new Discord.MessageEmbed({
          description: `Please supply a message to send to the channel.`,
        })
      );

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
    args.channel.send(args.message);
  }
}

module.exports = SayCommand;
