const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const channels = require('../../Constants/channels.json');
const moment = require('moment');
let channel;

class MessageDeleteBulkListener extends Listener {
  constructor() {
    super('messageDeleteBulk', {
      emitter: 'client',
      event: 'messageDeleteBulk',
      category: 'Client',
    });
  }

  async exec(messages) {
    moment.locale('en');
    const messageLogsCH = global.guild.channels.cache.get(
      channels.messageLogsChannel
    );
    messages.sort();
    messages.forEach((message) => {
      channel = message.channel.name;
    });

    messageLogsCH
      .send(
        new MessageEmbed({
          color: 'BLUE',
          title: `${messages.size} messages purged in #${channel}`,
          description: messages
            .map((x) => `[${x.author.tag}]: ${x.content}`)
            .join('\n'),
          footer: { text: `${messages.size} latest shown` },
          timestamp: new Date(),
        })
      )
      .catch((e) => {
        return;
      });
  }
}
module.exports = MessageDeleteBulkListener;
