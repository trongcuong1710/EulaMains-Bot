const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const channels = require('../../Constants/channels.json');
const moment = require('moment');

class RemoveQuoteCommand extends Command {
  constructor() {
    super('removequote', {
      aliases: ['removequote', 'rq'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      args: [
        {
          id: 'quote',
          type: 'string',
        },
      ],
      description: {
        description: 'Remove a quote from the database.',
        usage: 'removequote <trigger>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    if (!args.quote)
      return message.channel.send(
        new Discord.MessageEmbed({
          description: `Please supply a quote name to remove from the database.`,
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
    const quotes = await this.client.db.eulaQuotes.findOne({
      quoteName: args.quote,
    });
    if (await this.client.db.eulaQuotes.findOne({ quoteName: args.quote })) {
      await this.client.db.eulaQuotes
        .deleteOne({
          quoteName: args.quote,
        })
        .then(() => {
          this.client.channels.cache.get(channels.dbLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'RED',
              title: `Quote Removed`,
              description: `**${args.quote}** has now been removed.`,
              files: [
                {
                  id: 'quote.txt',
                  attachment: Buffer.from(quotes.quote, 'utf8'),
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
                  name: `Quote Was`,
                  value: 'View Attachment',
                  inline: false,
                },
                {
                  name: `Removed At`,
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
          `**${args.quote}** doesn't exist in the database!`
        )
      );
    message.channel.send(
      new Discord.MessageEmbed({
        color: 'RED',
        description: `**${args.quote}** has now been removed.`,
        footer: { text: 'View logs for details.' },
      })
    );
  }
}

module.exports = RemoveQuoteCommand;
