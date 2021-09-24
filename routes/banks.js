var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");

const Bank = require("../models/bank");
const mongoose = require("mongoose");
//сюди вставити адрес бази атласу
mongoose.connect("mongodb://localhost:27017/bank_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

router.get("/", function (req, res, next) {
  if (req.query.filter_property)
    Bank.find(
      {
        [req.query.filter_property]: req.query.filter_value,
      },
      function (err, docs) {
        if (err)
          return res
            .status(500)
            .json({ success: false, err: { msg: "Fetch failed!" } });
        res.status(200).json({ success: true, data: docs });
      }
    );
  else
    Bank.find({}, function (err, docs) {
      if (err)
        return res
          .status(500)
          .json({ success: false, err: { msg: "Fetch failed!" } });
      res.status(200).json({ success: true, data: docs });
    });
});

router.get("/:bankId", function (req, res, next) {
  Bank.findById(req.params["bankId"], function (err, doc) {
    if (err)
      return res.status(500).json({ success: false, err: { msg: "Failed!" } });
    res.status(200).json({ success: true, data: doc });
  });
});

router.post(
  "/add",
  body("bankName")
    .isLength({ min: 3 })
    .trim()
    .withMessage("Bank name must be specified")
    .escape(),
  body("interestRate")
    .isInt({ min: 1 })
    .withMessage("Interest rate must be  under 0.0001")
    .toInt(),
  body("maxLoan")
    .isInt({ min: 1 })
    .withMessage("Maximum loan must be  under 1")
    .toInt()
    .escape(),
  body("minDownPayment")
    .isInt({ min: 1 })
    .withMessage("Minimum Down Payment must be  under 1")
    .toInt()
    .escape(),
  body("loanTerm")
    .isInt({ min: 1 })
    .withMessage("Loan Term must be  under 1")
    .toInt()
    .escape(),

  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ success: false, err: errors.array() });
    }
    const bank = new Bank({
      bankName: req.body.bankName,
      interestRate: parseFloat(req.body.interestRate),
      maxLoan: parseFloat(req.body.maxLoan),
      minDownPayment: parseFloat(req.body.minDownPayment),
      loanTerm: parseInt(req.body.loanTerm),
    });
    bank.save(function (err) {
      if (err)
        return res
          .status(500)
          .json({ success: false, err: { msg: "Saving failed!" } });
      res.status(200).json({ success: true, bankId: bankDoc._id });
    });
  }
);

router.put(
  "/update",
  body("bankName")
    .isLength({ min: 3 })
    .trim()
    .withMessage("Bank name must be specified")
    .escape(),
  body("interestRate")
    .isInt({ min: 0.0001 })
    .withMessage("Interest rate must be  under 0.0001")
    .toInt(),
  body("maxLoan")
    .isInt({ min: 1 })
    .withMessage("Maximum loan must be  under 1")
    .toInt()
    .escape(),
  body("minDownPayment")
    .isInt({ min: 1 })
    .withMessage("Minimum Down Payment must be  under 1")
    .toInt()
    .escape(),
  body("loanTerm")
    .isInt({ min: 1 })
    .withMessage("Loan Term must be  under 1")
    .toInt()
    .escape(),

  function (req, res, next) {
    Bank.findByIdAndUpdate(
      req.body.bankId,
      {
        bankName: req.body.bankName,
        interestRate: parseFloat(req.body.interestRate),
        maxLoan: parseFloat(req.body.maxLoan),
        minDownPayment: parseFloat(req.body.minDownPayment),
        loanTerm: parseInt(req.body.loanTerm),
      },
      function (err) {
        if (err)
          return res
            .status(500)
            .json({ success: false, err: { msg: "Saving err!" } });
        res.status(200).json({ success: true });
      }
    );
  }
);

router.delete("/", function (req, res, next) {
  Bank.findByIdAndDelete(req.body.bankId, function (err) {
    if (err)
      return res
        .status(500)
        .json({ success: false, err: { msg: "Delete failed!" } });
    res.status(200).json({ success: true });
  });
});

module.exports = router;
