const mongoose = require('mongoose');
const TokenBlacklistSchema = new mongoose.Schema({
  token: String,
  expiresAt: Date
});
TokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model('TokenBlacklist', TokenBlacklistSchema);
