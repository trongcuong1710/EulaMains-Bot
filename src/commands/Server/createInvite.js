const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class InviteCommand extends Command {
  constructor() {
    super('invite', {
      aliases: ['invite', 'inv'],
      ownerOnly: false,
      category: 'Server',
      channel: 'guild',
      clientPermissions: 'CREATE_INSTANT_INVITE',
      userPermissions: 'CREATE_INSTANT_INVITE',
      cooldown: 10000,
      description: {
        description: 'Creates invite for the server and sends it.',
        usage: 'createinvite',
      },
    });
  }

  async exec(message) {
    moment.locale('en');
    if (!message.guild.vanityURLCode)
      return message.channel.createInvite().then((invite) => {
        message.channel.send(`https://discord.gg/${invite.code}`);
      });
    return message.channel.createInvite().then(() => {
      message.channel.send(`https://discord.gg/${message.guild.vanityURLCode}`);
    });
  }
}

module.exports = InviteCommand;
