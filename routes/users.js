var express = require("express");
var router = express.Router();
var Users = require("../schemas/user.schema");
var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);
var jwt = require("jsonwebtoken");
var SECRET = "eumatthew";

router.get("/", async function (req, res, next) {
  const data = await Users.find({ type: "STUDENT" });
  res.send({ data });
});

router.post("/signup", async function (req, res) {
  if (!req.body.first_name) {
    return res.send({ message: "First Name is required" });
  }

  if (!req.body.student_id) {
    return res.send({ message: "Student ID is required" });
  }

  const idExists = await Users.findOne({ student_id: req.body.student_id });

  if (idExists?.student_id === req.body.student_id) {
    return res.send({ message: "Student ID already exists" });
  }

  // if (!req.body.email) {
  //   return res.send({ message: "Email is required" });
  // }

  // const emailExists = await Users.findOne({ email: req.body.email });

  // if (emailExists?.email === req.body.email) {
  //   return res.send({ message: "Email already exists" });
  // }

  if (!req.body.last_name) {
    return res.send({ message: "Last Name is required" });
  }

  // if (!req.body.username) {
  //   return res.send({ message: "Username is required" });
  // }

  // const usernameExists = await Users.findOne({ username: req.body.username });

  // if (usernameExists?.username === req.body.username) {
  //   return res.send({ message: "Username already exists" });
  // }

  // if (!req.body.password) {
  //   return res.send({ message: "Password is required" });
  // }

  if (!req.body.course) {
    return res.send({ message: "Course is required" });
  }

  if (!req.body.year) {
    return res.send({ message: "Year is required" });
  }

  Users.create(
    {
      ...req.body,
      type: "STUDENT",
    },
    function (err) {
      if (err) {
        console.log(err);
        res.send({ message: "Error Creating a user" });
      } else {
        res.send({ message: "Successfully Created user", data: req.body });
      }
    }
  );
});

router.post("/register", async function (req, res) {
  Users.find({
    student_id: req.body.student_id,
    first_name: {
      $regex: req.body.first_name.trim(),
      $options: "i",
    },
    last_name: {
      $regex: req.body.last_name.trim(),
      $options: "i",
    },
    year: req.body.year,
    course: req.body.course,
  }).then(async (response) => {
    if (response.length) {
      const id = response[0]._id;
      if (!req.body.email) {
        return res.send({ message: "Email is required" });
      }
      const emailExists = await Users.findOne({ email: req.body.email });

      if (emailExists?.email === req.body.email) {
        return res.send({ message: "Email already exists" });
      }

      if (!req.body.username) {
        return res.send({ message: "Username is required" });
      }
      const usernameExists = await Users.findOne({
        username: req.body.username,
      });

      if (usernameExists?.username === req.body.username) {
        return res.send({ message: "Username already exists" });
      }
      if (!req.body.password) {
        return res.send({ message: "Password is required" });
      }

      Users.updateOne(
        {
          _id: id,
        },
        {
          email: req.body.email,
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, salt),
        },
        (err) => {
          if (err) {
            res.send({ message: "Error Creating a user" });
          } else {
            res.send({ message: "Successfully Created user", data: req.body });
          }
        }
      );
    } else {
      res.send({
        message:
          "Student does not exist on the database. Please contact administrator.",
      });
    }
  });
});

router.post("/login", async function (req, res) {
  try {
    if (!req.body.email) {
      res.send({ message: "Email is required" });
    }

    if (!req.body.password) {
      res.send({ message: "Password is required" });
    }

    const data = await Users.findOne({ email: req.body.email });

    console.log(data);

    const correctPassword = bcrypt.compareSync(
      req.body.password,
      data?.password
    );

    if (correctPassword) {
      const user = data.toObject();
      delete user.password;

      return res.send({
        accessToken: jwt.sign({ ...user }, SECRET, {
          expiresIn: "365d", // expires in 365 days
        }),
        message: "Login Successful",
      });
    }

    return res.send({ message: "Password is incorrect" });
  } catch (ex) {
    console.log(ex);
    return res.send({ error: true, message: "Something went wrong" });
  }
});

router.delete("/:id", async (req, res) => {
  const data = await Users.deleteOne({ _id: req.params.id });
  res.send(data);
});

module.exports = router;
