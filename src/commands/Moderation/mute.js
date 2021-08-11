const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const roles = require('../../Constants/roles.json');
const channels = require('../../Constants/channels.json');
const ms = require('ms');
const moment = require('moment');
const prettyMilliseconds = require('pretty-ms');

class MuteCommand extends Command {
  constructor() {
    super('mute', {
      aliases: ['mute'],
      clientPermissions: 'MUTE_MEMBERS',
      userPermissions: 'MUTE_MEMBERS',
      description: {
        description: 'Mute a member.',
        usage: 'mute <member> <duration> [reason]',
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

    if (!args.member) {
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `I couldn't find the user.`,
        })
      );
    }
    if (args.member.id === message.member.id)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `You can't silence yourself!`,
        })
      );
    if (args.member === message.guild.me)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `You can't silence me!`,
        })
      );

    if (
      args.member.roles.highest.position >=
      message.member.roles.highest.position
    )
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `You can't silence someone with an equal or higher role!`,
        })
      );

    let duration = ms(args.duration);
    if (!duration || duration > 1209600000)
      // Cap at 14 days, larger than 24.8 days causes integer overflow
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: 'Please enter a length of time of 14 days or less.',
        })
      );

    if (!args.reason) args.reason = '`None Provided`';
    if (args.reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (args.member.roles.cache.has(muteRole))
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `${args.member} is already muted.`,
        })
      );

    await args.member.roles.add(muteRole).then(async () => {
      await this.client.db.eulaMutes.create({
        member_id: args.member.id,
        unmuteDate: Date.now() + duration,
      });
      message.channel.send(
        new MessageEmbed({
          color: 'GREEN',
          description: `**${message.author.tag}** muted **${
            args.member.user.tag
          }** for ${prettyMilliseconds(duration, { verbose: true })}`,
        })
      );
      args.member
        .send(
          new MessageEmbed({
            color: 'RED',
            title: `You have been muted in ${global.guild.name}.`,
            description: `**Responsible Staff**: ${
              message.author.tag || message.author.username || message.author
            }\n**Reason**: ${args.reason}\n**Duration**: ${prettyMilliseconds(
              duration,
              { verbose: true }
            )}`,
            timestamp: new Date(),
          })
        )
        .catch((_) => {
          return;
        });
      this.client.channels.cache.get(channels.punishmentLogsChannel).send(
        new MessageEmbed({
          color: 'GREEN',
          title: `Muted`,
          description: `**Offender**: ${args.member.user.tag}\n**Reason**: ${
            args.reason
          }\n**Duration**: ${prettyMilliseconds(duration, {
            verbose: true,
          })}\n**Responsible Staff**: ${message.author.tag}`,
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
            new MessageEmbed({
              color: 'GREEN',
              title: `Member Unmuted`,
              description: `${args.member} has been unmuted.`,
              timestamp: new Date(),
            })
          );
          args.member
            .send(
              new MessageEmbed({
                color: 'RED',
                description: `You have been unmuted in ${global.guild.name}.`,
                timestamp: new Date(),
              })
            )
            .catch((_) => {
              return;
            });
        });
      }
      return;
    }, duration);
  }
}

module.exports = MuteCommand;
