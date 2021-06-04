const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const channels = require('../../Constants/channels.json');
const moment = require('moment');

class MessageUpdateListener extends Listener {
  constructor() {
    super('messageUpdate', {
      emitter: 'client',
      event: 'messageUpdate',
      category: 'Client',
    });
  }

  async exec(oldMessage, newMessage) {
    moment.locale('en');
    const messageLogsCH = global.guild.channels.cache.get(
      channels.messageLogsChannel
    );
    if (newMessage.partial) return;
    if (newMessage.author.bot) return;
    if (newMessage.content != oldMessage.content) {
      messageLogsCH.send(
        new MessageEmbed({
          color: 'BLUE',
          author: {
            name: newMessage.author.tag,
            iconURL: newMessage.author.displayAvatarURL({ dynamic: true }),
          },
          title: `Message Edited in #${newMessage.channel.name}`,
          description: `**Before**: ${oldMessage.content}\n**+After**: ${newMessage.content}\n\n[Jump To Message](${newMessage.url})`,
          footer: { text: `ID: ${newMessage.author.id}` },
          timestamp: new Date(),
        })
      );
    }
    let attachmentRegex =
      /([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))/g;
    if (newMessage.attachments.size < oldMessage.attachments.size) {
      if (
        oldMessage.attachments.every((attachment) => {
          const isImage = attachmentRegex.exec(attachment.name);
          return isImage;
        })
      )
        return messageLogsCH.send(
          new MessageEmbed({
            color: 'BLUE',
            author: {
              name: newMessage.author.tag,
              iconURL: newMessage.author.displayAvatarURL({ dynamic: true }),
            },
            title: `Message Edited in #${newMessage.channel.name}`,
            description: `**Before**: ${oldMessage.content}\n**+After**: ${newMessage.content}\n\n[Jump To Message](${newMessage.url})`,
            fields: [
              {
                name: 'Removed Attachment',
                value: oldMessage.attachments.array()[0].name,
              },
            ],
            image: {
              url: oldMessage.attachments.array()[0].attachment,
            },
            footer: { text: `ID: ${newMessage.author.id}` },
            timestamp: new Date(),
          })
        );
    }
  }
}
module.exports = MessageUpdateListener;
