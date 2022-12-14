var express = require("express");
var router = express.Router();
var Book = require("../schemas/book.schema");

var dateFilter = new Date(2017, 31, 12); // Year, Day, Month

router.get("/", async function (req, res, next) {
  // var perPage = body.limit;
  const perPage = 20;
  const page = req.query.page ?? 1;

  // https://stackoverflow.com/questions/11973304/mongodb-mongoose-querying-at-a-specific-date
  const data = await Book.find({
    createdAt: {
      $gte: dateFilter,
    },
  })
    .limit(perPage)
    .skip(perPage * (page - 1));
  res.send(data);
});

router.get("/archive", async function (req, res, next) {
  // https://stackoverflow.com/questions/11973304/mongodb-mongoose-querying-at-a-specific-date
  const data = await Book.find({
    createdAt: {
      $lt: dateFilter,
    },
  });
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
