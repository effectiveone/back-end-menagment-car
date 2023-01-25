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
  const tasks = {
    title,
    description,
    time,
    coinsToEarn,
    responsivePerson: null,
    status: "backlog",
  };

  const newTask = new Task(tasks);

  // Save Task in the database
  newTask
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

exports.getBacklogTasks = (req, res) => {
  Task.find({ status: "backlog" })
    .then((tasks) => {
      if (!tasks) {
        return res.status(404).send({
          message: "Tasks not found",
        });
      }
      res.status(200).send(tasks);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tasks.",
      });
    });
};

exports.getMyTasks = (req, res) => {
  const email = req.query.email;

  Task.find({
    $and: [
      { responsivePerson: email },
      { status: { $ne: "backlog" } },
      { status: { $ne: "Done" } },
    ],
  })
    .then((tasks) => {
      res.status(200).json({
        message: "Tasks fetched successfully",
        tasks: tasks,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
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
  // if (
  //   !req.body.title ||
  //   !req.body.description ||
  //   !req.body.time ||
  //   !req.body.coinsToEarn ||
  //   !req.body.responsivePerson ||
  //   !req.body.status
  // ) {
  //   return res.status(400).send({
  //     message: "Task content can not be empty",
  //   });
  // }
  // Find task and update it with the request body

  const title = xss.inHTMLData(sanitize(req.body.title));
  const description = xss.inHTMLData(sanitize(req.body.description));
  const time = xss.inHTMLData(sanitize(req.body.time));
  const coinsToEarn = xss.inHTMLData(sanitize(req.body.coinsToEarn));
  const responsivePerson = xss.inHTMLData(sanitize(req.body.responsivePerson));
  const status = xss.inHTMLData(sanitize(req.body.status));
  Task.findByIdAndUpdate(
    req.params.id,
    {
      responsivePerson: req.body.responsivePerson,
      status: req.body.status,
    },
    { new: true }
  )
    .then((task) => {
      if (!task) {
        return res.status(404).send({
          message: "Task not found with id " + req.body.id,
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
