const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const channels = require('../../Constants/channels.json');
const moment = require('moment');

class AddQuoteCommand extends Command {
  constructor() {
    super('addquote', {
      aliases: ['addquote', 'aq'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      args: [
        {
          id: 'quote',
          type: 'string',
        },
        {
          id: 'answer',
          type: 'string',
          match: 'rest',
        },
      ],
      description: {
        description: 'Add a quote to the database and call it when needed.',
        usage: 'addquote <trigger> <message/JSON for embed>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    if (!args.quote)
      return message.channel.send(
        new Discord.MessageEmbed({
          description: `Please supply a quote name to add into the database.`,
        })
      );
    if (!args.answer)
      return message.channel.send(
        new Discord.MessageEmbed({
          description: `Please supply a quote answer to add into the database.`,
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
    let data;
    let embed = false;
    try {
      data = JSON.stringify(
        new Discord.MessageEmbed(JSON.parse(args.answer)).toJSON()
      );

      embed = true;
    } catch (_) {
      data = args.answer;
    }
    if (!(await this.client.db.eulaQuotes.findOne({ quoteName: args.quote }))) {
      await this.client.db.eulaQuotes
        .create({
          quoteName: args.quote,
          quote: data,
          by: message.author.tag,
          embed: embed,
        })
        .then(() => {
          message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `**${args.quote}** has now been added.`,
              footer: { text: 'View logs for details.' },
            })
          );
          this.client.channels.cache.get(channels.dbLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              title: `Quote Added`,
              description: `**${args.quote}** has now been added.`,
              files: [
                {
                  id: 'quote.txt',
                  attachment: Buffer.from(args.answer, 'utf8'),
                  name: `quote.txt`,
                },
              ],
              fields: [
                {
                  name: `Responsible Staff`,
                  value: message.member,
                  inline: true,
                },
                { name: `Quote Name`, value: args.quote, inline: true },
                {
                  name: `Quote Is`,
                  value: 'View Attachment',
                  inline: false,
                },
                {
                  name: `Added At`,
                  value: moment().format('LLLL'),
                  inline: true,
                },
              ],
            })
          );
        });
    } else
      return message.channel.send(
        new Discord.MessageEmbed().setDescription(
          `**${args.quote}** is already in the database!`
        )
      );
  }
}

module.exports = AddQuoteCommand;
