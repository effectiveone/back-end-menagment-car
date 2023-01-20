const Task = require("../../models/Task");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");

exports.createTask = (req, res) => {
  // Validate request parameters
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.time ||
    !req.body.coinsToEarn
  ) {
    return res.status(400).send({
      message: "Task content can not be empty",
    });
  }
  const title = xss.inHTMLData(sanitize(req.body.title));
  const description = xss.inHTMLData(sanitize(req.body.description));
  const time = xss.inHTMLData(sanitize(req.body.time));
  const coinsToEarn = xss.inHTMLData(sanitize(req.body.coinsToEarn));
  // Create a new Task
  const task = new Task({
    title,
    description,
    time,
    coinsToEarn,
  });

  // Save Task in the database
  task
    .save()
    .then(() => res.status(200).json("You have successfully saved the data "))
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Task.",
      });
    });
};

exports.getAllTasks = (req, res) => {
  Task.find()
    .then((tasks) => {
      res.send(tasks);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tasks.",
      });
    });
};

exports.getTaskById = (req, res) => {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) {
        return res.status(404).send({
          message: "Task not found with id " + req.params.id,
        });
      }
      res.send(task);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Task not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving task with id " + req.params.id,
      });
    });
};

exports.updateTask = (req, res) => {
  // Validate Request
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.time ||
    !req.body.coinsToEarn
  ) {
    return res.status(400).send({
      message: "Task content can not be empty",
    });
  }
  // Find task and update it with the request body

  const title = xss.inHTMLData(sanitize(req.body.title));
  const description = xss.inHTMLData(sanitize(req.body.description));
  const time = xss.inHTMLData(sanitize(req.body.time));
  const coinsToEarn = xss.inHTMLData(sanitize(req.body.coinsToEarn));
  Task.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      time,
      coinsToEarn,
    },
    { new: true }
  )
    .then((task) => {
      if (!task) {
        return res.status(404).send({
          message: "Task not found with id " + req.params.id,
        });
      }
      res.send(task);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Task not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating task with id " + req.params.id,
      });
    });
};

exports.deleteTask = (req, res) => {
  Task.findByIdAndRemove(req.params.id)
    .then((task) => {
      if (!task) {
        return res.status(404).send({
          message: "Task not found with id " + req.params.id,
        });
      }
      res.send({ message: "Task deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Task not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete task with id " + req.params.id,
      });
    });
};
