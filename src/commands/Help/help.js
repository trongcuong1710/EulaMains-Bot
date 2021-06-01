const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class HelpCommand extends Command {
  constructor() {
    super('help', {
      aliases: ['help', 'h'],
      description: {
        usage: 'help <command>',
        description: 'In development.',
      },
      args: [
        {
          id: 'command',
          type: 'commandAlias',
        },
      ],
    });
  }

  async exec(message, args) {
    const prefix = this.client.commandHandler.prefix;
    if (!args.command)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'BLUE',
          description: `You expected me to show a list of commands with ${
            prefix + this.id
          }?\nWrong, you get my ko-fi page instead.\nhttps://ko-fi.com/zylasden.`,
        })
      );

    return message.channel.send(
      new Discord.MessageEmbed({
        color: 'BLUE',
        fields: [
          {
            name: `Command`,
            value: args.command.id,
            inline: true,
          },
          {
            name: `Aliases`,
            value:
              args.command.aliases.length > 1
                ? args.command.aliases
                    .filter((al) => al !== args.command.id)
                    .join(`\n`)
                : 'None.',
            inline: true,
          },
          {
            name: `Usage`,
            value: `\`${prefix + args.command.description.usage}\``,
            inline: true,
          },
          {
            name: `Description`,
            value: args.command.description.description,
            inline: false,
          },
        ],
      })
    );
  }
}

module.exports = HelpCommand;
