const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
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
        new MessageEmbed({
          description: `Please supply a quote name to remove from the database.`,
        })
      );
    const roles = [
      '821556056282103819', // 500's owner role
      '808507839382552598', // Admin
      // '808515071772459018', // Mod
      '830270184479522857', // Zyla
    ];
    var i;
    for (i = 0; i <= roles.length; i++) {
      if (
        message.member.roles.cache
          .map((x) => x.id)
          .filter((x) => roles.includes(x)).length === 0
      )
        return await message.channel.send(
          new MessageEmbed({
            color: 'RED',
            description: "You can't do that with the permissions you have.",
          })
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
          this.client.channels.cache.get(channels.databaseLogsChannel).send(
            new MessageEmbed({
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
        new MessageEmbed().setDescription(
          `**${args.quote}** doesn't exist in the database!`
        )
      );
    message.channel.send(
      new MessageEmbed({
        color: 'RED',
        description: `**${args.quote}** has now been removed.`,
        footer: { text: 'View logs for details.' },
      })
    );
  }
}

module.exports = RemoveQuoteCommand;
