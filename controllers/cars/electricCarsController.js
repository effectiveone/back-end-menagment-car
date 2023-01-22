const getAllElectricCars = require("./cars").getAllElectricCars;
const getElectricCar = require("./cars").getElectricCar;
const addElectricCar = require("./cars").addElectricCar;
const updateElectricCar = require("./cars").updateElectricCar;
const deleteElectricCar = require("./cars").deleteElectricCar;
const updateElectricCarProperties =
  require("./cars").updateElectricCarProperties;
const getReservations = require("./cars").getReservations;

exports.getAllElectricCars = getAllElectricCars;
exports.deleteElectricCar = deleteElectricCar;
exports.getElectricCar = getElectricCar;
exports.addElectricCar = addElectricCar;
exports.updateElectricCar = updateElectricCar;
exports.updateElectricCarProperties = updateElectricCarProperties;
exports.getReservations = getReservations;
