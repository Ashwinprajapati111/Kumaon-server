const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      fname: String,
      lname: String,
      mobile: String,
      gender: String,
      dep: String,
      email: String,
      password: String,
      published: Boolean,

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
   
  })
);

module.exports = Product;
