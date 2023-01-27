const Wallet = require("../../models/Wallet");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");
const { request } = require("express");

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

// exports.addCoin = (req, res, next) => {
//   const { mail, coins } = req.body;
//   Wallet.findOne({ mail: mail })
//     .then((wallet) => {
//       if (!wallet) {
//         return res.status(404).json({
//           message: "Wallet not found",
//         });
//       }
//       wallet.coins = wallet.coins + coins;
//       const newOperation = {
//         title: req.body.title,
//         previousValue: wallet.coins,
//         newValue: wallet.coins + req.body.coins,
//         value: req.body.coins,
//         date: new Date(),
//       };

//       const updatePromise = Wallet.findOneAndUpdate(
//         { mail: req.body.mail },
//         { $push: { bankingOperations: newOperation } },
//         { new: true }
//       ).exec();

//       const savePromise = wallet.save().exec();

//       Promise.all([updatePromise, savePromise])
//         .then((results) => {
//           res.status(200).json({
//             message: "Coins added successfully",
//             updatedWallet: results[0],
//             savedWallet: results[1],
//           });
//         })
//         .catch((err) => {
//           res.status(500).json({
//             error: err,
//           });
//         });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//       });
//     });
//   //   wallet
//   //     .save()
//   //     .then((result) => {
//   //       res.status(200).json({
//   //         message: "Coins added successfully",
//   //         wallet: result,
//   //       });
//   //     })
//   //     .catch((err) => {
//   //       res.status(500).json({
//   //         error: err,
//   //       });
//   //     });
//   // })
//   // .catch((err) => {
//   //   res.status(500).json({
//   //     error: err,
//   //   });
//   // });
// };

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
      const newOperation = {
        title: req.body.title,
        previousValue: wallet.coins,
        newValue: wallet.coins + req.body.coins,
        value: req.body.coins,
        date: new Date(),
      };

      const updatePromise = Wallet.findOneAndUpdate(
        { mail: req.body.mail },
        { $push: { bankingOperations: newOperation } },
        { new: true }
      ).exec();

      const savePromise = wallet.save().exec();

      Promise.all([updatePromise, savePromise])
        .then((results) => {
          res.status(200).json({
            message: "Coins added successfully",
            updatedWallet: results[0],
            savedWallet: results[1],
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

// exports.subtractCoins = (req, res, next) => {
//   Wallet.findOne({ mail: req.body.mail })
//     .then((wallet) => {
//       if (!wallet) {
//         return res.status(404).json({
//           message: "Wallet not found",
//         });
//       }

//       if (wallet.coins < req.body.coins) {
//         return res.status(400).json({
//           message: "Not enough coins",
//         });
//       }

//       wallet.coins = wallet.coins - req.body.coins;

//       const newOperation = {
//         title: req.body.title,
//         value: req.body.coins,
//         date: new Date(),
//       };

//       Wallet.findOneAndUpdate(
//         { mail: req.body.mail },
//         { $push: { bankingOperations: newOperation } },
//         { new: true }
//       )
//         .then((updatedWallet) => {
//           res.json(updatedWallet);
//         })
//         .catch((err) => {
//           res.json(err);
//         });

//       wallet
//         .save()
//         .then((result) => {
//           res.status(200).json({
//             message: "Coins subtracted successfully",
//             wallet: result,
//           });
//         })
//         .catch((err) => {
//           res.status(500).json({
//             error: err,
//           });
//         });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//       });
//     });
// };

exports.subtractCoins = (req, res, next) => {
  Wallet.findOne({ mail: req.body.mail })
    .then((wallet) => {
      if (!wallet) {
        return res.status(404).json({
          message: "Wallet not found",
        });
      }

      if (wallet.coins < req.body.coins) {
        return res.status(400).json({
          message: "Not enough coins",
        });
      }

      wallet.coins = wallet.coins - req.body.coins;

      const newOperation = {
        title: req.body.title,
        previousValue: wallet.coins,
        newValue: wallet.coins - req.body.coins,
        value: req.body.coins,
        date: new Date(),
      };
      const updatePromise = Wallet.findOneAndUpdate(
        { mail: req.body.mail },
        { $push: { bankingOperations: newOperation } },
        { new: true }
      );

      const newReservation = {
        title: req.body.title,
        selectedDate: req.body.selectedDate,
        dateOfMakingReservation: new Date(),
        email: req.body.email,
        coins: req.body.coins,
      };

      const updateReservations = Wallet.findOneAndUpdate(
        { mail: req.body.mail },
        { $push: { MyReservations: newReservation } },
        { new: true }
      );

      const savePromise = wallet.save();

      Promise.all([updatePromise, savePromise, updateReservations])
        .then((results) => {
          res.status(200).json({
            message: "Coins subtracted successfully",
            updatedWallet: results[0],
            savedWallet: results[1],
            updateReservations: results[2],
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
