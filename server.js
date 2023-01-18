const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const router = express.Router();
const authRoutes = require("./routes/authRoutes");
const PORT = process.env.PORT || process.env.API_PORT;

const helmet = require("helmet");

app.use(express.json());
app.use(cors());
app.use(helmet());

// register the routes
const ElectricCars = require("./models/ElectricCars");
router.get("/", (req, res) => {
  ElectricCars.find().exec((err, results) => {
    if (err) return res.send(err);

    res.status(200).json(results);
  });
  // .then((e) => res.json(e))
  // .catch((err) => res.status(400).json("Error: " + err));
});

app.use("/", router);

app.use("/api/auth", authRoutes);
const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is now listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed. Server not started");
    console.error(err);
  });
