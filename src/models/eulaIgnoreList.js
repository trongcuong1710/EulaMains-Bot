const mongoose = require('mongoose');

module.exports = mongoose.model(
  'eulaIgnoreList',
  new mongoose.Schema({
    member_id: String,
    ignoredBy: String,
  }),
  'eulaIgnoreList'
);
