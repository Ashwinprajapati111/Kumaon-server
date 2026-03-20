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

module.exports = mongoose.model("Gallery", gallerySchema);