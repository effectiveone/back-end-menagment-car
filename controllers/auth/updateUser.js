const mongoSanitize = require("mongo-sanitize");
const xss = require("xss-filters");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.updateUser = (req, res) => {
  const { userId } = req.params;
  let { username, password } = req.body;

  // Sanitize userId
  const cleanUserId = mongoSanitize(userId);

  // Sanitize username and password
  username = xss.inHTMLData(username);
  password = xss.inHTMLData(password);

  User.findById(cleanUserId, (err, user) => {
    if (err) {
      return res.status(500).send({
        message: "Error retrieving user with id " + cleanUserId,
      });
    }

    if (!user) {
      return res.status(404).send({
        message: "User not found with id " + cleanUserId,
      });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    user.username = username;
    user.password = hashedPassword;

    user.save((err, data) => {
      if (err) {
        return res.status(500).send({
          message: "Error updating user with id " + cleanUserId,
        });
      }

      // Create JWT token
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
      res.send({ user: data, token });
    });
  });
};
