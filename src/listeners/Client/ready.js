const { Listener } = require('discord-akairo');
const Discord = require('discord.js');
const channels = require('../../Constants/channels.json');
const moment = require('moment');
const roles = require('../../Constants/roles.json');

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
      category: 'Client',
    });
  }

  async exec() {
    console.log('Ready');
    global.guild = this.client.guilds.cache.get(process.env.EulaMains);

    const mutes = await this.client.db.eulaMutes.find();
    if (!mutes) return;

    mutes.forEach(async (x) => {
      const member = global.guild.members.cache.get(x.member_id);

      if (x.unmuteDate <= Date.now()) {
        return await member.roles.remove(roles.muteRole).then(async () => {
          await this.client.db.eulaMutes.deleteOne({
            member_id: member.id,
          });
          this.client.channels.cache.get(channels.logsChannel).send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              title: `Member Unmuted`,
              description: `${member} has been unmuted.`,
            })
          );
        });
      } else {
        return setTimeout(async () => {
          return member.roles.remove(roles.muteRole).then(async () => {
            await this.client.db.eulaMutes.deleteOne({
              member_id: member.id,
            });
            this.client.channels.cache.get(channels.logsChannel).send(
              new Discord.MessageEmbed({
                color: 'GREEN',
                title: `Member Unmuted (Auto Unmute)`,
                description: `${member} has been unmuted.`,
              })
            );
          });
        }, x.unmuteDate - Date.now());
      }
    });

    const modMails = await this.client.db.eulaModmail.find();
    if (!modMails) return;
    modMails.forEach(async (x) => {
      const member = global.guild.members.cache.get(x.member_id);
      const channel = global.guild.channels.cache.get(x.channel_id);

      await channel.messages.fetch().then(async (messages) => {
        messages.forEach(async (message) => {
          if (message.content == 'close ticket')
            await this.client.db.eulaModmail
              .deleteOne({ channel_id: channel.id })
              .then(async () => {
                await global.guild.channels.cache
                  .get(channels.dbLogsChannel)
                  .send(
                    new Discord.MessageEmbed({
                      color: 'RED',
                      description: `A ticket channel was deleted, so I deleted the ticket info from database.`,
                      fields: [
                        {
                          name: 'Ticket Author',
                          value: `${member}-(${member.id})`,
                        },
                        {
                          name: 'Deleted At',
                          value: moment().format('LLLL'),
                        },
                      ],
                    })
                  );
                await channel.delete().catch((e) => {
                  global.guild.channels.cache
                    .get(channels.errorLogsChannel)
                    .send(
                      process.env.BOT_OWNER,
                      new Discord.MessageAttachment(
                        Buffer.from(e.stack),
                        'error.txt'
                      )
                    );
                });
              });
        });
      });
    });
  }
}
module.exports = ReadyListener;
