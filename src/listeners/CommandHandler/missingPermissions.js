const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const ErrorHandler = require('../../util/errorHandler');

class MissingPermissionsListener extends Listener {
  constructor() {
    super('missingPermissions', {
      emitter: 'commandHandler',
      event: 'missingPermissions',
      category: 'CommandHandler',
    });
  }

  async exec(message, command, type, missing) {
    if (type === 'client')
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          title: 'Missing Permissions',
          description: `I need more powah :c`,
          fields: [
            { name: 'Command', value: command.handler.prefix + command.id },
            { name: 'Missing Permissions', value: missing },
          ],
        })
      );
    if (type === 'user')
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          title: 'Missing Permissions',
          description: 'You need more powah, but no begging for promotion >:(',
          fields: [
            { name: 'Command', value: command.handler.prefix + command.id },
            { name: 'Missing Permissions', value: missing },
          ],
        })
      );
  }
}

module.exports = MissingPermissionsListener;
