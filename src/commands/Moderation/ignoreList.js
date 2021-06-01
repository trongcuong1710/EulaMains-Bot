const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class IgnoreListCommand extends Command {
  constructor() {
    super('ignorelist', {
      aliases: ['ignorelist'],
      category: 'Moderation',
      channel: 'guild',
      description: {
        description: 'List ignored members.',
        usage: 'ignorelist',
      },
    });
  }

  async exec(message) {
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

    const ignoreList = await this.client.db.eulaIgnoreList.find();

    if (!ignoreList.length)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'BLUE',
          description: `There are no ignored members in the database.`,
        })
      );
    message.channel.send(
      new Discord.MessageEmbed({
        color: 'BLUE',
        title: `List of Ignored Members`,
        description: ignoreList
          .map(
            (x) =>
              `**Ignored Member:** ${x.member_id}\n**Ignored By**: ${message.author}`
          )
          .join('\n\n'),
      })
    );
  }
}

module.exports = IgnoreListCommand;
