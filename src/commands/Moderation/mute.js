const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const roles = require('../../Constants/roles.json');
const channels = require('../../Constants/channels.json');
const ms = require('ms');
const moment = require('moment');
const prettyMilliseconds = require('pretty-ms');

class MuteCommand extends Command {
  constructor() {
    super('mute', {
      aliases: ['mute'],
      userPermissions: 'MUTE_MEMBERS',
      description: {
        description: 'Mute a member.',
        usage: 'mute <member> <duration> <reason>',
      },
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
          id: 'duration',
          type: 'string',
          match: 'phrase',
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
        },
      ],
    });
  }

  async exec(message, args) {
    moment.locale('en');
    const muteRole = message.guild.roles.cache.get(roles.muteRole);
    const prefix = this.client.commandHandler.prefix;

    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <member> <duration> [reason]\n      ^^^^^^^^\nmember is a required argument that is missing.\`\`\``,
        })
      );

    if (args.member.id === message.member.id)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You can't silence yourself!`,
        })
      );
    if (args.member === message.guild.me)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You can't silence me!`,
        })
      );

    if (
      args.member.roles.highest.position >=
      message.member.roles.highest.position
    )
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You can't silence someone with an equal or higher role!`,
        })
      );

    let duration = ms(args.duration);

    if (!args.reason) args.reason = 'None Provided.';
    if (args.reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (args.member.roles.cache.has(muteRole))
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `${args.member} is already muted.`,
        })
      );

    await args.member.roles.add(muteRole).then(async () => {
      await this.client.db.eulaMutes.create({
        member_id: args.member.id,
        responsibleStaff: message.author.id,
        reason: args.reason,
        unmuteDate: Date.now() + duration,
      });
      message.channel.send(
        new Discord.MessageEmbed({
          color: 'GREEN',
          description: `**${message.author.tag}** muted **${
            args.member.user.tag
          }** ${
            duration
              ? `for ${prettyMilliseconds(duration, { verbose: true })}`
              : 'indefinitely.'
          }`,
        })
      );
      this.client.channels.cache.get(channels.punishmentLogsChannel).send(
        new Discord.MessageEmbed({
          color: 'GREEN',
          title: `Muted`,
          description: `**Offender**: ${args.member.user.tag}\n**Reason**: ${args.reason}\n**Responsible Staff**: ${message.author.tag}`,
          footer: { text: `ID: ${args.member.id}` },
          timestamp: new Date(),
        })
      );
    });

    setTimeout(async () => {
      if (args.member.roles.cache.has(muteRole.id)) {
        await args.member.roles.remove(muteRole).then(async () => {
          await this.client.db.eulaMutes.deleteOne({
            member_id: args.member.id,
          });
          this.client.channels.cache.get(channels.punishmentLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              title: `Unmuted`,
              description: `**Offender**: ${args.member.user.tag}\n**Reason**: ${args.reason}\n**Responsible Staff**: ${message.author.tag}`,
              footer: { text: `ID: ${args.member.id}` },
              timestamp: new Date(),
            })
          );
        });
      }
      return;
    }, duration);
  }
}

module.exports = MuteCommand;
