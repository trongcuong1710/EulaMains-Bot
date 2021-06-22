const { Command, AkairoClient } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const bot = require('../../../package.json');
const ms = require('ms');

class BotInfoCommand extends Command {
  constructor() {
    super('botinfo', {
      aliases: ['botinfo', 'binfo'],
      ownerOnly: false,
      category: 'Information',
      description: {
        description: 'Shows bot information.',
        usage: 'botinfo',
      },
    });
  }

  async exec(message) {
    moment.locale('en');
    await message.channel.send(
      new MessageEmbed({
        color: 'BLUE',
        description: `Hello, I'm Eula, your queen, nice to meet you!\n${
          this.client.users.cache.get(this.client.ownerID).username
        } is my creator, if there is anything I could do better please inform him!`,
        thumbnail: {
          url: this.client.user.displayAvatarURL({ dynamic: true, size: 512 }),
        },
        fields: [
          { name: 'Project Version:', value: bot.version },
          { name: 'Programming Language Used:', value: 'JavaScript' },
          {
            name: 'Prefix:',
            value: `\`${this.client.commandHandler.prefix}\``,
          },
          {
            name: 'Support Zyla',
            value: `[Ko-Fi](https://ko-fi.com/zylasden)`,
          },
          {
            name: 'Uptime',
            value: ms(this.client.uptime, { long: true }),
          },
        ],
      })
    );
  }
}

module.exports = BotInfoCommand;
