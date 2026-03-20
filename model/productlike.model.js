const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  likes: {
    type: Number,
    default: 0,
  },
  shares: {
    type: Number,
    default: 0,
  },
  shareHistory: [
    {
      platform: String,
      ip: String,
      userAgent: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// ✅ FIX HERE
module.exports = mongoose.models.Productlike || mongoose.model("Productlike", productSchema);