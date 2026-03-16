const mongoose = require("mongoose");

const Contact = mongoose.model(
  "contact",
  new mongoose.Schema(
    {
      firstname: String,
      lastname: String,
      email: String,
      phone: String,
      message: String
    },
    { timestamps: true }
  )
);


module.exports = Contact;