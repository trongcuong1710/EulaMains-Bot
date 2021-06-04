const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class SayCommand extends Command {
  constructor() {
    super('say', {
      aliases: ['say'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      userPermissions: 'MANAGE_MESSAGES',
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
        new MessageEmbed({
          description: `Please supply a channel to send the message.`,
        })
      );
    if (!args.message)
      return message.channel.send(
        new MessageEmbed({
          description: `Please supply a message to send to the channel.`,
        })
      );
    args.channel.send(args.message);
  }
}

module.exports = SayCommand;
