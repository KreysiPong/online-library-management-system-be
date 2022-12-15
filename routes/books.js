const e = require("express");
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
  if (req.body.year && req.body.title && typeof req.body.year === "number") {
    try {
      Book.find({
        title: req.body.title,
        isbn: req.body.isbn,
        year: +req.body.year,
        publisher: req.body.publisher,
        pages: req.body.pages,
        edition: req.body.edition,
        author: req.body.author,
        class: req.body.class,
      }).then((q) => {
        if (q.length === 1) {
          const id = q[0]._id;
          Book.updateOne(
            {
              _id: id,
            },
            {
              quantity: q[0].quantity + req.body.quantity,
            },
            (err) => {
              if (!err) {
                res.send({ message: "Error Creating a book" });
              } else {
                res.send({
                  message: "Successfully Created Book",
                  data: response,
                  status: true,
                });
              }
            }
          );
        } else {
          Book.create(req.body, function (err, response) {
            if (err) {
              console.log(err, req.body.title);
              res.send({ message: "Error Creating a book" });
            } else {
              res.send({
                message: "Successfully Created Book",
                data: response,
                status: true,
              });
            }
          });
        }
      });
    } catch (ex) {
      console.log(req.body.title);
      res.send({ message: "Error Creating a book" });
    }
  } else {
    res.send({
      message: "Incomplete required details",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const data = await Book.deleteOne({ _id: req.params.id });
  res.send(data);
});

module.exports = router;
