const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ElectricCarsSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  range: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
})

module.exports = ElectricCars = mongoose.model(
  "ElectricCars",
  ElectricCarsSchema
)
