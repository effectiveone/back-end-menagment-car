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

      const mappedResults = results.map((item) => {
        const plainObject = item.toObject();
        delete plainObject._id;
        delete plainObject.__v;
        return { id: item._id, ...plainObject };
      });

      res.status(200).json(mappedResults);
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
    const reservations = xss.inHTMLData(sanitize(req.body.reservations));

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
    ElectricCars.findOne({ _id: req.params.id }, (err, electricCar) => {
      if (err) return res.status(400).json("Error: " + err);

      let update;
      if (!electricCar.reservations) {
        update = {
          $set: {
            reservations: [{ date: req.body.date, mail: req.body.mail }],
          },
        };
      } else {
        update = {
          $push: {
            reservations: { date: req.body.date, mail: req.body.mail },
          },
        };
      }

      ElectricCars.findOneAndUpdate(
        { _id: req.params.id },
        update,
        { new: true },
        (err, electricCar) => {
          if (err) return res.status(400).json("Error: " + err);
          res.status(200).json("You have successfully updated the data ");
        }
      );
    });
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
  // getReservations: (req, res) => {
  //   ElectricCars.findById(req.params.id)
  //     .then((electricCar) => {
  //       if (electricCar.reservations) {
  //         res.json(electricCar.reservations);
  //       } else {
  //         res.status(200).json([]);
  //       }
  //     })
  //     .catch((err) => res.status(400).json("Error: " + err));
  // },

  getReservations: (req, res) => {
    ElectricCars.findById(req.params.id)
      .then((electricCar) => {
        if (electricCar.reservations) {
          res.status(200).json(electricCar.reservations);
        } else {
          res.status(200).json([{ date: null, mail: null }]);
        }
      })
      .catch((err) => res.status(400).json("Error: " + err));
  },
};

module.exports = electricCarsController;
