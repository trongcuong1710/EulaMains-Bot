const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class EditMessageCommand extends Command {
  constructor() {
    super('editmessage', {
      aliases: ['editmessage', 'em'],
      ownerOnly: false,
      category: 'Utility',
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
