const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth/authControllers");
const annoucmentControllers = require("../controllers/annoucment/annoucmentControllers");
const taskController = require("../controllers/task/taskControllers");
const walletControllers = require("../controllers/wallet/walletControllers");
const electricCarsController = require("../controllers/cars/electricCarsController");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const verifyToken = require("../middleware/auth");
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

//Annoucment Routes
router.post("/add-announcement", annoucmentControllers.addAnnouncement);
router.get("/get-announcements", annoucmentControllers.getAnnouncements);

//Logins/User Routes
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

// Wallet routes
router.post("/addCoins", walletControllers.addCoin);
router.post("/subtractCoins", walletControllers.subtractCoins);
router.get("/getWallet", walletControllers.getWallet);

// Task routes
router.post("/tasks", taskController.createTask);
router.get("/tasks", taskController.getAllTasks);
router.get("/getBacklogTasks", taskController.getBacklogTasks);
router.get("/getMyTasks", taskController.getMyTasks);
router.get("/tasks/:id", taskController.getTaskById);
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);

// Electric Cars routes
router.get("/", electricCarsController.getAllElectricCars);
router.get("/:id", electricCarsController.getElectricCar);
router.post("/add", electricCarsController.addElectricCar);
router.put("/update/:id", electricCarsController.updateElectricCar);
router.delete("/delete/:id", electricCarsController.deleteElectricCar);
router.put(
  "/update-properties/:id",
  electricCarsController.updateElectricCarProperties
);
router.get("/reservations/:id", electricCarsController.getReservations);

// test route to verify if our middleware is working
router.get("/test", verifyToken, (req, res) => {
  res.send("request passed");
});

module.exports = router;
