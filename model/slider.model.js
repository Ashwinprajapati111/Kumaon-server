const mongoose = require("mongoose");

const Slider = mongoose.model(
  "slider",
  new mongoose.Schema(
    {
      
      sliderimage: String

    },
    { timestamps: true })
);

module.exports = Slider;

