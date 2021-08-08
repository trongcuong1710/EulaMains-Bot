const { Command } = require('discord-akairo');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');
const roles = require('../../Constants/roles.json');

class ModmailCommand extends Command {
  constructor() {
    super('ticket', {
      aliases: ['ticket'],
      ownerOnly: false,
      category: 'Server',
      channel: 'dm',
      description: {
        description: 'Contact the Keqing Mains Staff team.',
        usage: 'ticket',
      },
    });
  }

  async exec(message) {
    moment.locale('en');
    let reasoning;
    const isIgnored = await this.client.db.eulaIgnoreList.findOne({
      member_id: message.author.id,
    });
    if (isIgnored) return;

    const hasTicket = await this.client.db.eulaModmail.findOne({
      member_id: message.author.id,
    });
    if (hasTicket) return;

    const admins = global.guild.roles.cache.get(roles.adminRole);
    const mods = global.guild.roles.cache.get(roles.modRole);

    message.channel
      .send(
        new MessageEmbed({
          color: 'BLUE',
          title: `What is your reasoning?`,
          description: `Please tell me what is the reasoning behind this ticket you're trying to open.`,
        })
      )
      .then(async () => {
        const filter = (m) => m.author.id === message.author.id;

        const collector = message.channel.createMessageCollector(filter, {
          max: 1,
        });
        collector.on('collect', (m) => {
          reasoning = m.content;
        });
        collector.on('end', async (collected) => {
          await global.guild.channels
            .create(`${message.author.username}`, {
              reason: `New ticket created by ${message.author.username}`,
              nsfw: true,
              type: 'text',
              parent: '848988669435314216',
              permissionOverwrites: [
                {
                  id: '808507839382552598', // Admin
                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                  id: '808515071772459018', // Mods
                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                  id: '808506580759740467', // muted
                  deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: message.author.id, // person who created the ticket
                  allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: '808500851395395657', // everyone
                  deny: ['VIEW_CHANNEL'],
                },
              ],
            })
            .then(async (channel) => {
              channel.setTopic(reasoning, 'Modmail Reason');
              await this.client.db.eulaModmail.create({
                member_id: message.author.id,
                channel_id: channel.id,
              });

              await message.channel.send(
                new MessageEmbed({
                  color: 'GREEN',
                  title: `Ticket Created!`,
                  description: `Please only use this if you have a question ONLY the administrators are able to answer and not for in-game Genshin questions.\n\nYour channel: <#${channel.id}>`,
                  footer: {
                    text: `Please wait for the staff to close the ticket.`,
                  },
                })
              );
              await channel.send(
                `Attention, ${admins} and ${mods}!`,
                new MessageEmbed({
                  color: 'BLUE',
                  description: `**${
                    message.author.tag ||
                    message.author.user.username ||
                    message.author
                  }-(${
                    message.author.id
                  })** has created a ticket.\nTheir reason for it is: **${reasoning}**.`,
                })
              );

              const filter = (m) => m.content;
              const collector = channel.createMessageCollector(filter);

              collector.on('collect', async (m) => {
                if (m.author.bot) return;

                if (m.content === 'close ticket') {
                  await this.client.db.eulaModmail.deleteOne({
                    member_id: message.author.id,
                  });
                  await collector.stop();
                  await channel.messages.fetch().then(async (messages) => {
                    const logs = messages
                      .filter((m) => m.author.id != '829299333685182484')
                      .sort(
                        (user, admin) =>
                          user.createdTimestamp - admin.createdTimestamp
                      )
                      .map((x) => `${x.author.username}: ${x.content}`)
                      .join('\n');
                    const modMailLogsChannel = guild.channels.cache.get(
                      channels.modMailLogsChannel
                    );
                    modMailLogsChannel.send(
                      `Ticket for ${message.author.username} is closed, read below for logs.`,
                      new MessageAttachment(
                        Buffer.from(logs),
                        `${message.author.username}-logs.txt`
                      )
                    );
                  });
                  await channel.delete();
                }
              });
            });
        });
      });
  }
}
module.exports = ModmailCommand;
