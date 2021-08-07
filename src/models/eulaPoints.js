const mongoose = require('mongoose');

module.exports = mongoose.model(
  'eulaPoints',
  new mongoose.Schema({
    member_id: String,
    points: Number,
  }),
  'eulaPoints'
);
