const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth/authControllers");
const annoucmentControllers = require("../controllers/annoucment/annoucmentControllers");
const taskController = require("../controllers/task/taskControllers");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const verifyToken = require("../middleware/auth");
const ElectricCars = require("../models/ElectricCars");
const mongoose = require("mongoose");
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");

const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

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

router.post("/add-announcement", annoucmentControllers.addAnnouncement);
router.get("/get-announcements", annoucmentControllers.getAnnouncements);

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
router.post("/loginout", verifyToken, authControllers.controllers.postLogout);
router.put("/users/:userId", authControllers.updateUser);

// Task routes
router.post("/tasks", taskController.createTask);
router.get("/tasks", taskController.getAllTasks);
router.get("/tasks/:id", taskController.getTaskById);
router.patch("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);

// Pobieranie wszystkich elementów z listy Todo
router.get("/", (req, res) => {
  ElectricCars.find().exec((err, results) => {
    if (err) return res.send(err);

    res.status(200).json(results);
  });
});

// Pobieranie jednego elementu z listy Todo
router.get("/:id", verifyToken, (req, res) => {
  ElectricCars.findById(req.params.id)
    .then((electricCar) => res.json(electricCar))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Dodawanie nowego elementu do listy Todo
router.post("/add", verifyToken, (req, res) => {
  const make = xss.inHTMLData(sanitize(req.body.make));
  const model = xss.inHTMLData(sanitize(req.body.model));
  const range = xss.inHTMLData(sanitize(req.body.range));
  const price = xss.inHTMLData(sanitize(req.body.price));

  const newElectricCar = new ElectricCars({
    make,
    model,
    range,
    price,
  });

  newElectricCar
    .save()
    .then(() => res.status(200).json("You have successfully saved the data "))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Modyfikowanie elementu z listy Todo
router.post("/update/:id", verifyToken, (req, res) => {
  ElectricCars.findById(req.params.id).then((electricCar) => {
    electricCar.make = req.body.make;
    electricCar.model = req.body.model;
    electricCar.range = req.body.range;
    electricCar.price = req.body.price;

    electricCar
      .save()
      .then(() => res.status(200).json("You have successfully saved the data "))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

// test route to verify if our middleware is working
router.get("/test", verifyToken, (req, res) => {
  res.send("request passed");
});

module.exports = router;
