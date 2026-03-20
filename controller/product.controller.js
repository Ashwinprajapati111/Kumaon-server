const db = require("../model");
const Product = db.product;


exports.create = async (req, res) => {

  try {

    if (!req.body.name) {
      return res.status(400).send({ message: "Content can not be empty!" });
    }

    let productimage = "";
    let productimages = [];
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
      wt: req.body.wt,
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

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {

  try {

    const id = req.params.id;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {

      return res.status(404).json({
        message: "Product not found"
      });

    }

    res.json({
      message: "Product deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// update product
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

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let productimage = product.productimage;
    let productbgimage = product.productbgimage;
    let productimages = product.productimages || [];

    // DELETE MAIN IMAGE
    if (req.body.removeProductImage === "true") {
      productimage = "";
    }

    // DELETE BG IMAGE
    if (req.body.removeBgImage === "true") {
      productbgimage = "";
    }

    // DELETE MULTIPLE IMAGES
    if (req.body.removedImages) {
      const removedImages = JSON.parse(req.body.removedImages);

      productimages = productimages.filter(
        (img) => !removedImages.some((url) => url.includes(img))
      );
    }

    // UPLOAD NEW MAIN IMAGE
    if (req.files?.productimage) {
      productimage = req.files.productimage[0].filename;
    }

    // UPLOAD NEW BG IMAGE
    if (req.files?.productbgimage) {
      productbgimage = req.files.productbgimage[0].filename;
    }

    // ADD NEW MULTIPLE IMAGES
    if (req.files?.productimages) {
      const newImages = req.files.productimages.map(
        (file) => file.filename
      );

      productimages = [...productimages, ...newImages];
    }

    // ✅ PARSE ARRAYS
    let why = req.body.why ? JSON.parse(req.body.why) : product.why;
    let faq = req.body.faq ? JSON.parse(req.body.faq) : product.faq;

    // ✅ IMPORTANT FIX FOR WT
    const wtValue = req.body.wt !== undefined ? req.body.wt : product.wt;

    // ✅ UPDATE MANUALLY
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        wt: wtValue, // ✅ FIXED
        Properties: req.body.Properties,
        Ingredients: req.body.Ingredients,
        Single_Origin: req.body.Single_Origin,
        Taste_Notes: req.body.Taste_Notes,
        Why_main_title: req.body.Why_main_title,
        Why_main_desc: req.body.Why_main_desc,
        Disclaimer: req.body.Disclaimer,
        productimage,
        productbgimage,
        productimages,
        why,
        faq
      },
      { new: true }
    );

    res.json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};