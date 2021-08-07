const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
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
          match: 'rest',
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
        new MessageEmbed({
          color: 'RED',
          description:
            'Please input a mathematical operation or conversion such as 2 + 2 (which is 5 (i am a giga brain (yeah (how about that (b*tch)))))',
        })
      );
    try {
      message.channel.send(
        this.client.util
          .embed()
          .setColor('BLUE')
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription('Did I do it right?')
          .addFields([
            {
              name: 'Input:',
              value: string(args.input),
            },
            {
              name: 'Output:',
              value: string(evaluate(args.input)),
            },
          ])
      );
    } catch (e) {
      await message.channel.send(
        new MessageEmbed({ color: 'RED', description: e.message })
      );
    }
  }
}

module.exports = CalculateCommand;
