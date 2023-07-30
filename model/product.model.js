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

      

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
   
  },
  { timestamps: true})
);

module.exports = Product;
