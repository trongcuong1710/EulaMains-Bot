const { Command } = require('discord-akairo');
const { MessageEmbed, MessageAttachment } = require('discord.js');

class QuotesCommand extends Command {
  constructor() {
    super('quotes', {
      aliases: ['quotes'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      args: [
        {
          id: 'quoteName',
          type: 'string',
        },
      ],
      description: {
        description: 'Shows list of quotes.',
        usage: 'quotes',
      },
    });
  }

  async exec(message, args) {
    const quotes = await this.client.db.eulaQuotes.find();

    if (!quotes.length)
      return message.channel.send(
        new MessageEmbed({
          description: `There are no quotes in the database.`,
        })
      );

    if (!args.quoteName) {
      const list = quotes.map((x) => `Quote Name: ${x.quoteName}`).join('\n');
      return message.channel.send(
        `You can use \`.quotes <quoteName>\` to view a quote.`,
        new MessageAttachment(Buffer.from(list), 'quotes.txt')
      );
    }

    const quoteIsRegistered = await this.client.db.eulaQuotes.findOne({
      quoteName: args.quoteName,
    });

    if (!quoteIsRegistered)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `Quote: \`${args.quoteName}\`\nDoes not exist in the database.`,
        })
      );
    const quoteOfName = await this.client.db.eulaQuotes.find({
      quoteName: args.quoteName,
    });
    const quoteFromNameNoEmbed = quoteOfName
      .map(
        (x) =>
          `Quote Name: ${x.quoteName}\nQuote Returns: ${x.quote}\nAdded By: ${x.by}`
      )
      .join('\n');
    const quoteFromNameYesEmbed = quoteOfName
      .map(
        (x) =>
          `Quote Name: ${x.quoteName}\nAdded By: ${x.by}\nEmbed Source: ${x.quote}\nDown below you can see a preview of the embed.`
      )
      .join('\n');
    const quoteFromNameAttachment = new MessageAttachment(
      Buffer.from(quoteFromNameNoEmbed),
      `${args.quoteName}.txt`
    );
    const quoteFromNameAttachmentWithEmbed = new MessageAttachment(
      Buffer.from(quoteFromNameYesEmbed),
      `${args.quoteName}.txt`
    );
    const isQuoteEmbed = quoteOfName.map((x) => x.embed).join('\n');
    if (isQuoteEmbed == 'false') message.channel.send(quoteFromNameAttachment);
    else {
      message.channel.send([
        this.client.util.embed(
          JSON.parse(quoteOfName.map((x) => x.quote).join('\n'))
        ),
        quoteFromNameAttachmentWithEmbed,
      ]);
    }
  }
}

module.exports = QuotesCommand;
