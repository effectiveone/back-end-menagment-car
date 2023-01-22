const createTask = require("./task").createTask;
const getAllTasks = require("./task").getAllTasks;
const getTaskById = require("./task").getTaskById;
const updateTask = require("./task").updateTask;
const findByIdAndUpdate = require("./task").findByIdAndUpdate;
const deleteTask = require("./task").deleteTask;
const getBacklogTasks = require("./task").getBacklogTasks;
const getMyTasks = require("./task").getMyTasks;

exports.getTaskById = getTaskById;
exports.updateTask = updateTask;
exports.createTask = createTask;
exports.getAllTasks = getAllTasks;
exports.findByIdAndUpdate = findByIdAndUpdate;
exports.deleteTask = deleteTask;
exports.getBacklogTasks = getBacklogTasks;
exports.getMyTasks = getMyTasks;
