const {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
} = require('discord-akairo');

require('dotenv').config();

const mongoose = require('mongoose');

class MyClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: '488699894023061516',
      },
      {
        disableMentions: 'everyone',
        fetchAllMembers: true,
        partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
        presence: {
          activity: {
            name: `DM .ticket to contact staff!`,
            type: 'PLAYING',
          },
          status: 'dnd',
          afk: false,
        },
      }
    );
    this.commandHandler = new CommandHandler(this, {
      directory: './src/commands',
      prefix: '.',
      automateCategories: true,
      allowMention: true,
      blockBots: true,
      blockClient: true,
    });
    this.commandHandler.handle = async function (message) {
      // if (message.author.id != this.client.ownerID) return;
      if (
        !(await this.client.db.eulaBlacklists.findOne({
          channel_id: message.channel,
        }))
      )
        return CommandHandler.prototype.handle.call(this, message);
    };
    this.listenerHandler = new ListenerHandler(this, {
      directory: './src/listeners/',
      automateCategories: true,
    });
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    });
    this.commandHandler.loadAll();
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();

    mongoose
      .connect(`${process.env.MONGOOSE_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => console.log('Connected to the database!'));

    this.db = {
      eulaWarns: mongoose.model(
        'eulaWarns',
        new mongoose.Schema({
          warnID: Number,
          warnedStaff: String,
          warnedMember: String,
          reason: String,
          when: Date,
        }),

        'eulaWarns'
      ),
      eulaQuotes: mongoose.model(
        'eulaQuotes',
        new mongoose.Schema({
          quoteName: String,
          quote: String,
          by: String,
          embed: Boolean,
        }),
        'eulaQuotes'
      ),
      eulaBlacklists: mongoose.model(
        'eulaBlacklists',
        new mongoose.Schema({
          channel_id: String,
          blacklistedBy: String,
        }),
        'eulaBlacklists'
      ),
      eulaIgnoreList: mongoose.model(
        'eulaIgnoreList',
        new mongoose.Schema({
          member_id: String,
          ignoredBy: String,
        }),
        'eulaIgnoreList'
      ),
      eulaCustomRoles: mongoose.model(
        'eulaCustomRoles',
        new mongoose.Schema({
          roleID: String,
          roleOwner: String,
        }),
        'eulaCustomRoles'
      ),
      eulaModmail: mongoose.model(
        'eulaModmail',
        new mongoose.Schema({
          channel_id: String,
          member_id: String,
        }),
        'eulaModmail'
      ),
      eulaMutes: mongoose.model(
        'eulaMutes',
        new mongoose.Schema({
          member_id: String,
          responsibleStaff: String,
          reason: String,
          unmuteDate: Number,
        }),
        'eulaMutes'
      ),
    };
  }
}

const client = new MyClient();
client.login();
