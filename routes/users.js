var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const schema = new mongoose.Schema({
  first_name: "string",
  last_name: "string",
  year: "number",
  course: "string",
  id_number: "string",
  username: "string",
  password: "string",
  email: "string"
});
const Users = mongoose.model('Users', schema);

router.get('/', async function (req, res, next) {
  const data = await Users.find({});
  res.send(data);
});

router.post('/', function (req, res) {
  Users.create(req.body, function (err, small) {
    if (err) {
      console.log(err);

      res.send({ message: 'Error Creating a book' });
    } else {
      res.send({ message: 'Successfully Created Book' });
    }
  });
})

router.delete('/:id', async (req, res) => {
  const data = await Users.deleteOne({ _id: req.params.id });
  res.send(data);
})

module.exports = router;
