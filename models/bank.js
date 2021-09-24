const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bankSchema = new Schema({
  bankName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0.0001,
  },
  maxLoan: {
    type: Number,
    required: true,
    min: 1,
  },
  minDownPayment: {
    type: Number,
    required: true,
    min: 1,
  },
  loanTerm: {
    type: Number,
    required: true,
    min: 1,
  },
});

module.exports = mongoose.model("Bank", bankSchema);
