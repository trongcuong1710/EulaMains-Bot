const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class EditEmbedCommand extends Command {
  constructor() {
    super('editembed', {
      aliases: ['editembed', 'ee'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      userPermissions: 'MANAGE_MESSAGES',
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
        description: 'Edits an embed.',
        usage: 'editembed <messageID> <new embed>',
      },
    });
  }

  async exec(message, args) {
    if (!args.messageID)
      return message.channel.send(
        new MessageEmbed({
          description: `You must provide a message ID that is sent by **me**.`,
        })
      );
    if (!args.newMessage)
      return message.channel.send(
        new MessageEmbed({
          description: `You must provide a new embed to replace the old one.`,
        })
      );
    args.messageID
      .edit(new MessageEmbed(JSON.parse(args.newMessage)))
      .catch(async (e) => await catchError(e, message, this.id));
  }
}

module.exports = EditEmbedCommand;
