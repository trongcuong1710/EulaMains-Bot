const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class BanCommand extends Command {
  constructor() {
    super('ban', {
      aliases: ['ban', 'b'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      clientPermissions: 'BAN_MEMBERS',
      userPermissions: 'BAN_MEMBERS',
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
          id: 'reason',
          type: 'string',
          match: 'rest',
        },
      ],
      description: {
        description: 'Ban the specified member.',
        usage: 'ban <member> <reason>',
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
          } <member> [reason]\n     ^^^^^^^^\nmember is a required argument that is missing.\`\`\``,
        })
      );

    if (!args.reason) args.reason = '`None Provided`';
    if (args.reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (
      args.member.roles.highest.position >=
      message.member.roles.highest.position
    )
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Sorry but you can't ban other staff members/staff members that has higher perms than you.`,
        })
      );

    const banList = await message.guild.fetchBans();

    const bannedUser = banList.some((user) => user.id === args.member.id);

    if (bannedUser)
      return await message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `${bannedUser} is already banned!`,
        })
      );
    else
      await args.member.ban({ reason: args.reason }).then(() => {
        message.channel.send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            description: `Successful ban!`,
            fields: [
              { name: 'Member', value: args.member.displayName },
              { name: 'Reason', value: args.reason },
            ],
          })
        );
        this.client.channels.cache.get(channels.logsChannel).send(
          new Discord.MessageEmbed({
            color: 'RED',
            title: `Ban`,
            fields: [
              {
                name: 'Member',
                value: args.member,
              },
              {
                name: 'Responsible Staff',
                value: message.member,
              },
              {
                name: 'Reason',
                value: args.reason,
              },
              {
                name: 'Banned At',
                value: moment().format('LLLL'),
              },
            ],
            thumbnail: {
              url: args.member.user.displayAvatarURL({
                dynamic: true,
              }),
            },
          })
        );
        args.member
          .send(
            new Discord.MessageEmbed({
              color: 'RED',
              title: `You've been banned from ${message.guild.name}`,
              fields: [
                { name: 'Responsible Staff', value: message.member },
                { name: 'Reason', value: args.reason },
                {
                  name: 'Banned At',
                  value: moment().format('LLLL'),
                },
              ],
              footer: {
                text: `If you think you're wrongfully banned, please contact an Admin.`,
              },
            })
          )
          .catch((e) => {
            return;
          });
      });
  }
}

module.exports = BanCommand;
