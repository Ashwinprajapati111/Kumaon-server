<<<<<<< HEAD
const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: String,
    coverImage: String,
    eventDate: Date,
    photos: {
      type: [String],
      default: []
    },
      // ✅ NEW FIELD
  },
  { timestamps: true }
);

=======
const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: String,
    coverImage: String,
    eventDate: Date,
    photos: {
      type: [String],
      default: []
    },
      // ✅ NEW FIELD
  },
  { timestamps: true }
);

>>>>>>> da519bf15187260a85ab19c7b295e18769fb6202
module.exports = mongoose.model("Gallery", gallerySchema);