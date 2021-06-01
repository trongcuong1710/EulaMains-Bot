const mongoose = require('mongoose');

module.exports = mongoose.model(
  'eulaBlacklists',
  new mongoose.Schema({
    channel_id: String,
    blacklistedBy: String,
  }),
  'eulaBlacklists'
);
