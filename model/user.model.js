const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  type: String,
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  password: String,

  // ❌ REMOVE old single address fields
  // address, city, state, country, pincode, type

  // ✅ ADD THIS
  addresses: [addressSchema],

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);