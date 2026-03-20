const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      name: String,
      price: Number,
      desc: String,
      productimage: String,
      productimages: [String],
      productbgimage: String,
      Properties: String,
      Ingredients: String,
      Single_Origin: String,
      Taste_Notes: String,
      Why_main_title: String,
      Why_main_desc: String,
      Disclaimer: String,
      wt: String,
      why: [
        {
          why_question: String,
          why_answer: String
        }
      ],
      faq: [
        {
          faq_question: String,
          faq_answer: String
        }
      ]
    },
    { timestamps: true })
);

module.exports = Product;

