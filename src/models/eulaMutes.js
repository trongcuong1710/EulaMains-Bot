const mongoose = require('mongoose');

module.exports = mongoose.model(
  'eulaMutes',
  new mongoose.Schema({
    member_id: String,
    unmuteDate: Number,
  }),
  'eulaMutes'
);
