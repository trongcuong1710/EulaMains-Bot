const mongoose = require('mongoose');

module.exports = mongoose.model(
  'eulaModmail',
  new mongoose.Schema({
    channel_id: String,
    member_id: String,
  }),
  'eulaModmail'
);
