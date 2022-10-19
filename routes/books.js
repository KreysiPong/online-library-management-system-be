var express = require("express");
var router = express.Router();
var Book = require("../schemas/book.schema");

router.get("/", async function (req, res, next) {
  const data = await Book.find({});
  res.send(data);
});

router.post("/create", function (req, res) {
  Book.create(req.body, function (err, response) {
    if (err) {
      console.log(err);

      res.send({ message: "Error Creating a book" });
    } else {
      res.send({
        message: "Successfully Created Book",
        data: response,
        status: true,
      });
    }
  });
});

router.delete("/:id", async (req, res) => {
  const data = await Book.deleteOne({ _id: req.params.id });
  res.send(data);
});

module.exports = router;
