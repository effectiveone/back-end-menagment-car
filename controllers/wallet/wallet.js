const Wallet = require("../../models/wallet");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");

exports.getWallet = (req, res, next) => {
  Wallet.findOne({ user: req.user.id })
    .then((wallet) => {
      if (!wallet) {
        return res.status(404).json({
          message: "Wallet not found",
        });
      }
      res.status(200).json({
        wallet: wallet,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.addCoin = (req, res, next) => {
  Wallet.findOne({ user: req.user.id })
    .then((wallet) => {
      if (!wallet) {
        const newWallet = new Wallet({
          user: req.user.id,
          coins: 1,
        });
        newWallet
          .save()
          .then((result) => {
            res.status(201).json({
              message: "Coin added successfully",
              wallet: result,
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      } else {
        wallet.coins = wallet.coins + 1;
        wallet
          .save()
          .then((result) => {
            res.status(200).json({
              message: "Coin added successfully",
              wallet: result,
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.subtractCoins = (req, res, next) => {
  Wallet.findOne({ user: req.user.id })
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
