const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const channels = require('../../Constants/channels.json');
const moment = require('moment');

class GuildBanRemoveListener extends Listener {
  constructor() {
    super('guildBanRemove', {
      emitter: 'client',
      event: 'guildBanRemove',
      category: 'Client',
    });
  }

  async exec(guild, user) {
    moment.locale('en');
    const punishmentLogsCH = guild.channels.cache.get(
      channels.punishmentLogsChannel
    );
    await punishmentLogsCH.send(
      new MessageEmbed({
        color: 'BLUE',
        title: 'Unbanned',
        description: `**Offender**: ${user.tag}`,
        footer: {
          text: `ID: ${user.id}`,
        },
        timestamp: new Date(),
      })
    );
  }
}
module.exports = GuildBanRemoveListener;
