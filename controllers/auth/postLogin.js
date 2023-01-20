const mongoSanitize = require("mongo-sanitize");
const xss = require("xss-filters");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginAttempts = new Map();
const loginThreshold = 500; // max number of login attempts
const loginBanTime = 60; // in minutes

const postLogin = async (req, res) => {
  try {
    // sanitize input data
    const sanitizedMail = mongoSanitize(req.body.mail);
    const sanitizedPassword = mongoSanitize(req.body.password);

    // find user
    const user = await User.findOne({ mail: sanitizedMail.toLowerCase() });

    const loginKey = user ? user._id : req.ip;
    if (loginAttempts.has(loginKey) && loginAttempts.get(loginKey).banned) {
      return res
        .status(429)
        .send("Too many login attempts. Please try again later");
    }

    if (user && (await bcrypt.compare(sanitizedPassword, user.password))) {
      loginAttempts.delete(loginKey);
      if (user.isAdmin) {
        // do something for admin
      } else {
        // do something for non-admin
      }

      // send new token
      const token = jwt.sign(
        {
          userId: user._id,
          mail: xss.inHTMLData(user.mail), // escaping special characters
          isAdmin: user.isAdmin,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );

      return res.status(200).json({
        userDetails: {
          mail: xss.inHTMLData(user.mail), // escaping special characters
          token: token,
          username: xss.inHTMLData(user.username), // escaping special characters
          isAdmin: user.isAdmin,
        },
      });
    } else {
      // increment login attempts
      if (!loginAttempts.has(loginKey)) {
        loginAttempts.set(loginKey, {
          count: 1,
          banned: false,
          banExpires: null,
        });
      } else {
        const loginData = loginAttempts.get(loginKey);
        loginData.count++;

        // ban IP address or user if login threshold is reached
        if (loginData.count >= loginThreshold) {
          loginData.banned = true;
          loginData.banExpires = Date.now() + loginBanTime * 60 * 1000; // in milliseconds
        }
        loginAttempts.set(loginKey, loginData);
      }
      return res.status(400).send("Invalid credentials. Please try again");
    }
  } catch (err) {
    return res.status(500).send("Something went wrong. Please try again");
  }
};

module.exports = postLogin;
