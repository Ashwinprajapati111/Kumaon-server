const db = require("../model");
const Admin = db.admin;


exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password
  });
  admin
    .save(admin)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the signup.",
      });
    });
};
exports.delete = (req, res) => {
  const id = req.params.id;

  Admin.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete State with id=${id}. Maybe State was not found!`
        });
      } else {
        res.send({
          message: "State was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete State with id=" + id
      });
    });
};

exports.findAll = (req, res) => {
  Admin.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "some error occured while retriving product",
      });
    });
};