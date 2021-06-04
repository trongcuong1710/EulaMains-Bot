const mongoose = require('mongoose');

module.exports = mongoose.model(
  'eulaMutes',
  new mongoose.Schema({
    member_id: String,
    responsibleStaff: String,
    reason: String,
    unmuteDate: Number,
  }),
  'eulaMutes'
);
