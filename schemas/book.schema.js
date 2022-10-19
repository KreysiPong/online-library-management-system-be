var mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    class: "string",
    author: "string",
    title: "string",
    edition: "string",
    volume: "string",
    pages: "number",
    source_of_fund: "string",
    publisher: "string",
    year: "number",
    remarks: "string",
    locator: "string",
    isbn: "string",
    quantity: "number",
  },
  {
    timestamps: true,
  }
);
const Book = mongoose.model("Book", schema);

module.exports = Book;
