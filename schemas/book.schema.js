var mongoose = require("mongoose");

const schema = new mongoose.Schema({
  number: "string", // 0001;
  date_received: "date",
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
});
const Book = mongoose.model("Book", schema);

module.exports = Book;
