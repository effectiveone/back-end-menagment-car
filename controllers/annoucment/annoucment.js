const Announcement = require("../../models/Announcement");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");

exports.addAnnouncement = (req, res) => {
  const description = xss.inHTMLData(sanitize(req.body.description));
  const title = xss.inHTMLData(sanitize(req.body.title));

  const newAnnouncement = new Announcement({ description, title });
  newAnnouncement
    .save()
    .then(() => res.status(200).json("You have successfully saved the data "))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.getAnnouncements = (req, res) => {
  Announcement.find({}, (err, announcements) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({ announcements });
  });
};
