const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  mail: { type: String, required: true },
  coins: { type: Number, default: 10 },
  lastCoinReceived: { type: Date },
});

module.exports = mongoose.model("Wallet", walletSchema);
