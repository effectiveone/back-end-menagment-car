const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  coinsToEarn: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  responsivePerson: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
