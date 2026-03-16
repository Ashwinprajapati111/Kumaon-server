const mongoose = require("mongoose");

const Admin = mongoose.model(
  "Admin",
  new mongoose.Schema(
    {
      name: String,
      email: String,
      mobile: String,
      password: String,
         
  },
  { timestamps: true})
);

module.exports = Admin;
