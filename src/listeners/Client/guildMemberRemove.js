const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const channels = require('../../Constants/channels.json');
const moment = require('moment');

class GuildMemberRemoveListener extends Listener {
  constructor() {
    super('guildMemberRemove', {
      emitter: 'client',
      event: 'guildMemberRemove',
      category: 'Client',
    });
  }

  async exec(member) {
    moment.locale('en');
    const joinLeaveCH = member.guild.channels.cache.get(
      channels.joinLeaveChannel
    );
    const punishmentLogsCH = member.guild.channels.cache.get(
      channels.punishmentLogsChannel
    );
    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: 'MEMBER_KICK',
    });
    const kickLog = fetchedLogs.entries.first();

    if (!kickLog)
      return joinLeaveCH.send(
        new MessageEmbed({
          color: 'BLUE',
          author: {
            name: member.tag,
            iconURL: member.user.displayAvatarURL({ dynamic: true }),
          },
          title: 'Member Left',
          description: `${member} joined ${moment()
            .startOf('day')
            .fromNow()}\n**Roles**: ${member.roles.cache
            .map((r) => r.name)
            .join('\n')}`,
          footer: `ID: ${member.id}`,
          timestamp: new Date(),
        })
      );

    const { executor, target } = kickLog;
    if (target.id === member.id)
      return punishmentLogsCH.send(
        new MessageEmbed({
          color: 'RED',
          title: 'Kicked',
          description: `**Offender**: ${member.user.tag}\n**Reason**: ${kickLog.reason}\n**Responsible Staff**: ${executor.tag}`,
          footer: { text: `ID: ${member.id}` },
          timestamp: new Date(),
        })
      );
  }
}
module.exports = GuildMemberRemoveListener;
