const createTask = require("./task").createTask;
const getAllTasks = require("./task").getAllTasks;
const getTaskById = require("./task").getTaskById;
const updateTask = require("./task").updateTask;
const findByIdAndUpdate = require("./task").findByIdAndUpdate;
const deleteTask = require("./task").deleteTask;

exports.getTaskById = getTaskById;
exports.updateTask = updateTask;
exports.createTask = createTask;
exports.getAllTasks = getAllTasks;
exports.findByIdAndUpdate = findByIdAndUpdate;
exports.deleteTask = deleteTask;
