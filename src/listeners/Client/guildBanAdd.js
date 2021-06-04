const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const channels = require('../../Constants/channels.json');
const moment = require('moment');

class GuildBanAddListener extends Listener {
  constructor() {
    super('guildBanAdd', {
      emitter: 'client',
      event: 'guildBanAdd',
      category: 'Client',
    });
  }

  async exec(guild, user) {
    moment.locale('en');
    const punishmentLogsCH = guild.channels.cache.get(
      channels.punishmentLogsChannel
    );
    await guild.fetchBan(user).then(async (ban) => {
      await punishmentLogsCH.send(
        new MessageEmbed({
          color: 'RED',
          title: 'Banned',
          description: `**Offender**: ${ban.user.tag}\n**Reason**: ${ban.reason}`,
          footer: {
            text: `ID: ${ban.user.id}`,
          },
          timestamp: new Date(),
        })
      );
    });
  }
}
module.exports = GuildBanAddListener;
