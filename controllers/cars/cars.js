const ElectricCars = require("../../models/ElectricCars");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const xss = require("xss-filters");
const sanitize = require("mongo-sanitize");

const electricCarsController = {
  // Pobieranie wszystkich elementów z listy Todo
  getAllElectricCars: (req, res) => {
    ElectricCars.find().exec((err, results) => {
      if (err) return res.send(err);

      res.status(200).json(results);
    });
  },

  // Pobieranie jednego elementu z listy Todo
  getElectricCar: (req, res) => {
    ElectricCars.findById(req.params.id)
      .then((electricCar) => res.json(electricCar))
      .catch((err) => res.status(400).json("Error: " + err));
  },

  // Dodawanie nowego elementu do listy Todo
  addElectricCar: (req, res) => {
    const make = xss.inHTMLData(sanitize(req.body.make));
    const model = xss.inHTMLData(sanitize(req.body.model));
    const range = xss.inHTMLData(sanitize(req.body.range));
    const price = xss.inHTMLData(sanitize(req.body.price));
    const reservations = req.body.reservations;

    const newElectricCar = new ElectricCars({
      make,
      model,
      range,
      price,
      reservations,
    });

    newElectricCar
      .save()
      .then(() => res.status(200).json("You have successfully saved the data "))
      .catch((err) => res.status(400).json("Error: " + err));
  },

  // Modyfikowanie elementu z listy Todo
  updateElectricCar: (req, res) => {
    ElectricCars.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { reservations: { date: req.body.date, mail: req.body.mail } } },
      { new: true },
      (err, electricCar) => {
        if (err) return res.status(400).json("Error: " + err);
        res.status(200).json("You have successfully updated the data ");
      }
    );
  },

  deleteElectricCar: (req, res) => {
    ElectricCars.findByIdAndDelete(req.params.id)
      .then(() => res.status(200).json("Car deleted."))
      .catch((err) => res.status(400).json("Error: " + err));
  },

  // Update properties of a specific car without changing the reservation date
  updateElectricCarProperties: (req, res) => {
    ElectricCars.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .then((electricCar) => res.json(electricCar))
      .catch((err) => res.status(400).json("Error: " + err));
  },

  // Get the reservation array of a specific car
  getReservations: (req, res) => {
    ElectricCars.findById(req.params.id)
      .then((electricCar) => res.json(electricCar.reservations))
      .catch((err) => res.status(400).json("Error: " + err));
  },
};

module.exports = electricCarsController;
