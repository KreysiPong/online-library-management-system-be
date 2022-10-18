var mongoose = require("mongoose");

const schema = new mongoose.Schema({
  first_name: "string",
  last_name: "string",
  year: "number",
  course: "string",
  username: "string",
  password: "string",
  email: "string",
  student_id: "string",
  type: "string",
});

const Users = mongoose.model("Users", schema);

module.exports = Users;
