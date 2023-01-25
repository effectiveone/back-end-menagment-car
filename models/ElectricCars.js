const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ElectricCarsSchema = new Schema({
  make: {
    type: String,
  },
  model: {
    type: String,
  },
  range: {
    type: String,
  },
  price: {
    type: String,
  },
  reservations: [
    {
      date: {
        type: Date,
      },
    },
  ],
});

module.exports = ElectricCars = mongoose.model(
  "ElectricCars",
  ElectricCarsSchema
);
