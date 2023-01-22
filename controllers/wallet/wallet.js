const Wallet = require("../../models/Wallet");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");

exports.getWallet = (req, res, next) => {
  Wallet.findOne({ mail: req.query.mail }).then((wallet) => {
    if (!wallet) {
      // Create a new wallet with 10 coins
      const newWallet = new Wallet({
        mail: req.query.mail,
        coins: 10,
      });
      newWallet
        .save()
        .then((result) => {
          res.status(201).json({
            message: "Wallet created successfully",
            wallet: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    } else {
      res.status(200).json({
        message: "Wallet found successfully",
        wallet: wallet,
      });
    }
  });
};

exports.addCoin = (req, res, next) => {
  const { mail, coins } = req.body;
  Wallet.findOne({ mail: mail })
    .then((wallet) => {
      if (!wallet) {
        return res.status(404).json({
          message: "Wallet not found",
        });
      }
      wallet.coins = wallet.coins + coins;
      wallet
        .save()
        .then((result) => {
          res.status(200).json({
            message: "Coins added successfully",
            wallet: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.subtractCoins = (req, res, next) => {
  Wallet.findOne({ mail: req.body.mail })
    .then((wallet) => {
      if (!wallet) {
        return res.status(404).json({
          message: "Wallet not found",
        });
      }

      if (wallet.coins - req.body.coins < 0) {
        return res.status(400).json({
          message: "Not enough coins",
        });
      }

      wallet.coins = wallet.coins - req.body.coins;
      wallet
        .save()
        .then((result) => {
          res.status(200).json({
            message: "Coins subtracted successfully",
            wallet: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
