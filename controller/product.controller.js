const db = require("../model");
const Product = db.product;


exports.create = async (req, res) => {

  try {

    if (!req.body.name) {
      return res.status(400).send({ message: "Content can not be empty!" });
    }

    let productimage = "";
    let productimages = [] ;
    let productbgimage = "";

    // Check uploaded file
    if (req.files && req.files["productimage"]) {
      productimage = req.files["productimage"][0].filename;
    }
    if (req.files && req.files["productimages"]) {
      productimages = req.files["productimages"].map((file) => file.filename);
    }
    if (req.files && req.files["productbgimage"]) {
      productbgimage = req.files["productbgimage"][0].filename;
    }

    let why = [];
    if (req.body.why) {
      why = JSON.parse(req.body.why);
    }

    let faq = [];
    if (req.body.faq) {
      faq = JSON.parse(req.body.faq);
    }
    const product = new Product({
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
      productimage: productimage,
      productimages: productimages,
      productbgimage: productbgimage,
      Properties: req.body.Properties,
      Ingredients: req.body.Ingredients,
      Single_Origin: req.body.Single_Origin,
      Taste_Notes: req.body.Taste_Notes,
      Why_main_title: req.body.Why_main_title,
      Why_main_desc: req.body.Why_main_desc,
      Disclaimer: req.body.Disclaimer,
      why: why,
      faq: faq
    });

    const savedProduct = await product.save();

    res.status(200).json(savedProduct);

  } catch (error) {

    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      message: error.message || "Some error occurred while creating product."
    });

  }

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

exports.findAll = (req, res) => {
  Product.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "some error occured while retriving product",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Product.findById(id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Product not found with id " + id,
        });
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Product with id " + id,
      });
    });
};


