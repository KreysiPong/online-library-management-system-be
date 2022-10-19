var mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    quantity: "number",
    returned: "boolean",
  },
  {
    timestamps: true,
  }
);
const Borrow = mongoose.model("Borrow", schema);

module.exports = Borrow;
