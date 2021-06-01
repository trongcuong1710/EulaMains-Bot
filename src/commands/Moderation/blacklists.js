const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class BlacklistsCommand extends Command {
  constructor() {
    super('blacklists', {
      aliases: ['blacklists', 'blist'],
      category: 'Moderation',
      channel: 'guild',
      description: {
        description: 'List blacklisted channels.',
        usage: 'blacklists',
      },
    });
  }

  async exec(message, args) {
    const permRoles = [
      '821556056282103819', // 500's owner role
      '808507839382552598', // Admin
      '808515071772459018', // Mod
      '830270184479522857', // Zyla
    ];
    var i;
    for (i = 0; i <= permRoles.length; i++) {
      if (
        message.member.roles.cache
          .map((x) => x.id)
          .filter((x) => permRoles.includes(x)).length === 0
      )
        return message.channel.send(
          new MessageEmbed({
            color: 'RED',
            description: "You can't do that with the permissions you have.",
          })
        );
    }

    const blacklists = await this.client.db.eulaBlacklists.find();
    if (!blacklists.length)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'BLUE',
          description: `There are no blacklisted channels in the database.`,
        })
      );
    message.channel.send(
      new Discord.MessageEmbed({
        color: 'BLUE',
        title: `Blacklisted Channels`,
        description: blacklists
          .map(
            (x) =>
              `**Blacklisted Channel:** ${x.channel_id}\n**Blacklisted By:** ${x.blacklistedBy}`
          )
          .join('\n\n'),
      })
    );
  }
}

module.exports = BlacklistsCommand;
