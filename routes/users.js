var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

const schema = new mongoose.Schema({
  first_name: "string",
  last_name: "string",
  year: "number",
  course: "string",
  id_number: "string",
  username: "string",
  password: "string",
  email: "string",
});
const Users = mongoose.model("Users", schema);

// routes
// defime routes for every action
router.get("/", async function (req, res, next) {
  const data = await Users.find({});
  res.send(data);
});

router.post("/create", function (req, res) {
  Users.create(
    {
      ...req.body,
      password: bcrypt.hashSync(req.body.password, salt),
    },
    function (err) {
      if (err) {
        res.send({ message: "Error Creating a user" });
      } else {
        res.send({ message: "Successfully Created user" });
      }
    }
  );
});

router.post("/login", async function (req, res) {
  console.log(req.body);
  if (!req.body.username) {
    res.send({ message: "Username is required", status: "error" });
  }

  if (!req.body.password) {
    res.send({ message: "Password is required", status: "error" });
  }

  const data = await Users.findOne({ email: req.body.email });

  const correctPassword = bcrypt.compareSync(req.body.password, data.password);

  if (correctPassword) {
    res.send({ data, status: "success" });
  } else {
    res.send({ message: "Password is incorrect", status: "error" });
  }
});

router.delete("/:id", async (req, res) => {
  const data = await Users.deleteOne({ _id: req.params.id });
  res.send(data);
});

module.exports = router;
