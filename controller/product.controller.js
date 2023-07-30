const db = require("../model");
const Product = db.product;


exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "asdfasdfContent can not be empty!" });
    return;
  }

  // Create a Tutorial
  const product = new Product({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    dep: req.body.dep,
    mobile: req.body.mobile,
    password: req.body.password,
    gender: req.body.gender,
    published: req.body.published ? req.body.published : false,
  });
  product
    .save(product)
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
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   Product.findByIdAndRemove(id)
//     .then(data => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot delete State with id=${id}. Maybe State was not found!`
//         });
//       } else {
//         res.send({
//           message: "State was deleted successfully!"
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete State with id=" + id
//       });
//     });
// };

// exports.findAll = (req, res) => {
//   Product.find()
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "some error occured while retriving product",
//       });
//     });
// };