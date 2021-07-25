const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { arg } = require('mathjs');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class RoleCommand extends Command {
  constructor() {
    super('role', {
      aliases: ['role'],
      category: 'Moderation',
      userPermissions: 'MANAGE_ROLES',
      args: [
        {
          id: 'member',
          type: (message, phrase) => {
            return this.client.util.resolveMember(
              phrase,
              message.guild.members.cache,
              false,
              true
            );
          },
        },
        {
          id: 'role',
          type: (message, phrase) => {
            return this.client.util.resolveRole(
              phrase,
              message.guild.roles.cache,
              false,
              true
            );
          },
          match: 'rest',
        },
      ],
      description: {
        description: 'Adds/removes a role from the specified member.',
        usage: 'role <member> <role>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    const prefix = this.client.commandHandler.prefix;
    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <member> <role>\n      ^^^^^^^^\nmember is a required argument that is missing.\`\`\``,
        })
      );

    if (!args.role)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <member> <role>\n               ^^^^^^\nrole is a required argument that is missing.\`\`\``,
        })
      );

    if (args.role.position >= message.member.roles.highest.position)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `No, duh.`,
        })
      );

    if (!args.member.roles.cache.has(args.role.id)) {
      await args.member.roles.add(args.role.id).then(() => {
        message.channel.send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            description: `Added **${args.role.name}** to **${args.member}**!`,
            footer: {
              text: `ID: ${args.member.id} | Role ID: ${args.role.id}`,
            },
          })
        );
      });
    } else {
      return await args.member.roles.remove(args.role.id).then(() => {
        message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `Removed **${args.role.name}** from **${args.member}**!`,
            footer: {
              text: `ID: ${args.member.id} | Role ID: ${args.role.id}`,
            },
          })
        );
      });
    }
  }
}

module.exports = RoleCommand;
