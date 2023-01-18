const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");

const postRegister = async (req, res) => {
  try {
    const { username, mail, password } = req.body;
    const sanitizedMail = xss.inHTMLData(sanitize(mail));
    const sanitizedUsername = xss.inHTMLData(sanitize(username));
    const sanitizedPassword = xss.inHTMLData(sanitize(password));
    // check if user exists
    const userExists = await User.exists({ mail: mail.toLowerCase() });

    if (userExists) {
      return res.status(409).send("E-mail already in use.");
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(sanitizedPassword, 10);

    // create user document and save in database
    const user = await User.create({
      username: sanitizedUsername,
      mail: sanitizedMail.toLowerCase(),
      password: encryptedPassword,
      isAdmin: false,
    });

    // create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        mail: sanitizedMail,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      userDetails: {
        mail: user.mail,
        token: token,
        username: user.username,
        isAdmin: false,
      },
    });
  } catch (err) {
    return res.status(500).send("Error occured. Please try again");
  }
};

module.exports = postRegister;
