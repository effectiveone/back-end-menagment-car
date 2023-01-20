const postLogin = require("./postLogin");
const postLogout = require("./postLogout");
const postRegister = require("./postRegister");
const updateUser = require("./updateUser").updateUser;

exports.updateUser = updateUser;

exports.controllers = {
  postLogin,
  postLogout,
  postRegister,
};
