const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  mail: { type: String, required: true },
  coins: { type: Number, default: 10 },
  lastCoinReceived: { type: Date },
  bankingOperations: [
    {
      title: { type: String },
      value: { type: Number },
      previousValue: { type: Number },
      newValue: { type: Number },
      date: { type: Date },
    },
  ],
  MyReservations: [
    {
      title: { type: String },
      selectedDate: { type: Date },
      dateOfMakingReservation: { type: Date },
      email: { type: String },
      coins: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Wallet", walletSchema);
