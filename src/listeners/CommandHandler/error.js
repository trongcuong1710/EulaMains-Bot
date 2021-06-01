const { Listener } = require('discord-akairo');
const ErrorHandler = require('../../util/errorHandler');

class ErrorListener extends Listener {
  constructor() {
    super('error', {
      emitter: 'commandHandler',
      event: 'error',
      category: 'CommandHandler',
    });
  }

  async exec(error, message, command) {
    await ErrorHandler.interactiveErrorHandler(
      error,
      message.author,
      message,
      command
    );
  }
}

module.exports = ErrorListener;
