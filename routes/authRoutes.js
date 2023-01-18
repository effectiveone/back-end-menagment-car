const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth/authControllers");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middleware/auth");
const ElectricCars = require("../models/ElectricCars");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(12).required(),
  password: Joi.string().min(6).max(12).required(),
  mail: Joi.string().email().required(),
  isAdmin: Joi.boolean().default(false),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).max(12).required(),
  mail: Joi.string().email().required(),
});

router.post(
  "/register",
  validator.body(registerSchema),
  authControllers.controllers.postRegister
);
router.post(
  "/login",
  validator.body(loginSchema),
  authControllers.controllers.postLogin
);

// Pobieranie wszystkich elementów z listy Todo
router.get("/", (req, res) => {
  ElectricCars.find().exec((err, results) => {
    if (err) return res.send(err);

    res.status(200).json(results);
  });
});

// Pobieranie jednego elementu z listy Todo
router.get("/:id", (req, res) => {
  ElectricCars.findById(req.params.id)
    .then((electricCar) => res.json(electricCar))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Dodawanie nowego elementu do listy Todo
router.post("/add", (req, res) => {
  const make = req.body.make;
  const model = req.body.model;
  const range = req.body.range;
  const price = req.body.price;

  const newElectricCar = new ElectricCars({
    make,
    model,
    range,
    price,
  });

  newElectricCar
    .save()
    .then(() => res.json("Todo added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Modyfikowanie elementu z listy Todo
router.post("/update/:id", (req, res) => {
  ElectricCars.findById(req.params.id).then((electricCar) => {
    electricCar.make = req.body.make;
    electricCar.model = req.body.model;
    electricCar.range = req.body.range;
    electricCar.price = req.body.price;

    electricCar
      .save()
      .then(() => res.json("Todo updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

// test route to verify if our middleware is working
router.get("/test", auth, (req, res) => {
  res.send("request passed");
});

module.exports = router;
