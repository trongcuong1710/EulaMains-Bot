const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const channels = require('../../Constants/channels.json');
const moment = require('moment');

class MessageDeleteListener extends Listener {
  constructor() {
    super('messageDelete', {
      emitter: 'client',
      event: 'messageDelete',
      category: 'Client',
    });
  }

  async exec(message) {
    moment.locale('en');
    const messageLogsCH = global.guild.channels.cache.get(
      channels.messageLogsChannel
    );
    if (!message.partial) {
      if (message.author.bot) return;
      let attachmentRegex =
        /([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))/g;
      if (message.attachments.size > 0) {
        if (
          message.attachments.every((attachment) => {
            const isImage = attachmentRegex.exec(attachment.name);
            return isImage;
          })
        )
          return messageLogsCH.send(
            new MessageEmbed({
              color: 'BLUE',
              author: {
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              },
              title: `Message Deleted in #${message.channel.name}`,
              description: `${
                message.content.length > 1024
                  ? message.content.slice(0, 1021) + '...'
                  : message.content
              }`,
              fields: [
                {
                  name: 'Attachment',
                  value: message.attachments.array()[0].name,
                },
              ],
              image: {
                url: message.attachments.array()[0].attachment,
              },
              footer: { text: `ID: ${message.author.id}` },
              timestamp: new Date(),
            })
          );
      }
      await messageLogsCH.send(
        new MessageEmbed({
          color: 'BLUE',
          author: {
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          },
          title: `Message Deleted in #${message.channel.name}`,
          description: `${
            message.content.length > 1024
              ? message.content.slice(0, 1021) + '...'
              : message.content
          }`,
          footer: { text: `ID: ${message.author.id}` },
          timestamp: new Date(),
        })
      );
    }
  }
}
module.exports = MessageDeleteListener;
