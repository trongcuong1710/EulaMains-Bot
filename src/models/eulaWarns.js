const mongoose = require('mongoose');

module.exports = mongoose.model(
  'eulaWarns',
  new mongoose.Schema({
    warnID: Number,
    warnedMember: String,
    warnedStaff: String,
    reason: String,
    when: Date,
  }),
  'eulaWarns'
);
