const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  userId: { type: String, required: true },
  coinBalance: { type: Number, default: 10 },
  lastCoinReceived: { type: Date },
});

module.exports = mongoose.model("Wallet", walletSchema);
