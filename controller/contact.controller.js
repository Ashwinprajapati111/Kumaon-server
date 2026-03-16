const db = require("../model");
const Contact = db.contact;

exports.create = (req, res) => {

  // Validate request
  if (!req.body.firstname) {
    return res.status(400).send({
      message: "First name cannot be empty!"
    });
  }

  // Create contact message
  const contact = new Contact({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message
  });

  contact
    .save()
    .then((data) => {
      res.send({
        message: "Message sent successfully",
        data: data
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while saving contact."
      });
    });

};
exports.delete = (req, res) => {
  const id = req.params.id;

  Contact.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Contact with id=${id}. Maybe Contact was not found!`
        });
      } else {
        res.send({
          message: "Contact was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Contact with id=" + id
      });
    });
};

exports.findAll = (req, res) => {
  Contact.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "some error occured while retriving product",
      });
    });
};