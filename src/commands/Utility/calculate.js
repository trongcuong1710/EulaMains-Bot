const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { evaluate, string } = require('mathjs');

class CalculateCommand extends Command {
  constructor() {
    super('calculate', {
      aliases: ['calculate', 'calc'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      args: [
        {
          id: 'input',
          type: 'string',
        },
      ],
      description: {
        description: 'Does math for you.',
        usage: 'calculate <math>',
      },
    });
  }

  async exec(message, args) {
    if (!args.input)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description:
            'Please input a mathematical operation or conversion such as "1 km to m" (yes with quotes)',
        })
      );

    message.channel
      .send(
        this.client.util.embed().addFields([
          {
            name: 'Input:',
            value: string(args.input),
          },
          {
            name: 'Output:',
            value: string(evaluate(args.input)),
          },
        ])
      )
      .catch(
        async (e) =>
          await message.channel.send(
            new Discord.MessageEmbed({ color: 'RED', description: e.message })
          )
      );
  }
}

module.exports = CalculateCommand;
