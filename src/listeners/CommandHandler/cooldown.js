const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');

class CooldownListener extends Listener {
  constructor() {
    super('cooldown', {
      emitter: 'commandHandler',
      event: 'cooldown',
      category: 'CommandHandler',
    });
  }

  exec(message, command, remaining) {
    const prefix = this.client.commandHandler.prefix;
    message.channel.send(
      message.member,
      new MessageEmbed({
        color: 'RED',
        description: `\`${prefix + command}\` is on cooldown for you.`,
        fields: [
          {
            name: `Remaining`,
            value: prettyMilliseconds(remaining, { verbose: true }),
          },
        ],
      })
    );
  }
}

module.exports = CooldownListener;
