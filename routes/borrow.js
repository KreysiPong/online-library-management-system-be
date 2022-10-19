var express = require("express");
var router = express.Router();
var Borrowers = require("../schemas/borrow.schema");
var Books = require("../schemas/book.schema");

router.get("/", async function (req, res, next) {
  const data = await Borrowers.find({})
    .populate({ path: "borrower", select: "username" })
    .populate({ path: "book", select: "title" });

  return res.send(data);
});

router.post("/book", async function (req, res) {
  try {
    console.log(req.body);
    if (!req.body.userId) {
      return res.send({ message: "User ID is required" });
    }

    if (!req.body.bookId) {
      return res.send({ message: "Book ID is required" });
    }

    const data = await Books.findOne({ _id: req.body.bookId });
    if (data) {
      const quantity = data.toObject().quantity;

      if (!quantity) {
        return res.send({ message: "Current book is out of stock" });
      } else {
        Books.updateOne(
          { _id: req.body.bookId },
          {
            quantity: quantity - 1,
          },
          function (err) {
            if (err) {
              return res.send({
                message: "Error upon borrowing book. Please try again later.",
              });
            }

            const userId = req.body.userId;
            const bookId = req.body.bookId;

            Borrowers.findOne({
              borrower: userId,
              book: bookId,
            })
              .lean()
              .exec(function (err, doc) {
                if (doc) {
                  Borrowers.updateOne(
                    {
                      _id: doc._id,
                    },
                    {
                      quantity: doc.quantity + 1,
                    },
                    function (err) {
                      if (err) {
                        return res.send({
                          message:
                            "Error borrowing book. Please try again later.",
                        });
                      } else {
                        return res.send({
                          message: "Successfully borrowed book",
                        });
                      }
                    }
                  );
                } else {
                  Borrowers.create({
                    borrower: req.body.userId,
                    book: req.body.bookId,
                    quantity: 1,
                  })
                    .then((response) => {
                      return res.send({
                        status: true,
                        message: "Successfully borrowed book",
                      });
                    })
                    .catch((ex) => {
                      return res.send({
                        message:
                          "Error borrowing book. Please try again later.",
                      });
                    });
                }
              });
          }
        );
      }
    }
  } catch (ex) {
    return res.send({ message: "Something went wrong" });
  }
});

module.exports = router;
