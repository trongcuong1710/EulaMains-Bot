const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class EditMessageCommand extends Command {
  constructor() {
    super('editmessage', {
      aliases: ['editmessage', 'em'],
      ownerOnly: false,
      category: 'Utility',
      userPermissions: 'MANAGE_MESSAGES',
      channel: 'guild',
      args: [
        {
          id: 'messageID',
          type: 'message',
        },
        {
          id: 'newMessage',
          type: 'string',
          match: 'rest',
        },
      ],
      description: {
        description: 'Edits a message.',
        usage: 'editmessage <messageID> <new message>',
      },
    });
  }

  async exec(message, args) {
    if (!args.messageID)
      return message.channel.send(
        new Discord.MessageEmbed({
          description: `You must provide a message ID that is sent by **me**.`,
        })
      );
    if (!args.newMessage)
      return message.channel.send(
        new Discord.MessageEmbed({
          description: `You must provide a message to replace the old one.`,
        })
      );
    args.messageID.edit(args.newMessage);
  }
}

module.exports = EditMessageCommand;
