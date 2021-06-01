const mongoose = require('mongoose');

module.exports = mongoose.model(
  'eulaCustomRoles',
  new mongoose.Schema({
    roleID: String,
    roleOwner: String,
  }),
  'eulaCustomRoles'
);
