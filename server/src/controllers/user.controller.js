const User = require("../models/user.model");
const bcrypt = require('bcrypt');

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Hash the password
  const hashedPassword = bcrypt.hash(req.body.password, 10);

  // Create an User
  const user = new User({
    fullname: req.body.fullname,
    email: req.body.email,
    password: hashedPassword,
    isAdmin: true,
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user."
      });
    else res.send(data);
  });
};

// Retrieve all users from the database
exports.findAll = (_, res) => {
    User.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      else res.send(data);
    });
};