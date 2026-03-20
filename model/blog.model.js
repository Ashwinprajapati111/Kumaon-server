const mongoose = require("mongoose");

const Blog = mongoose.model(
  "blog",
  new mongoose.Schema(
    {
      title: String,
      subtitle: [
        {
          subtitlein: String,
          subtitlematter: String
        }
      ],
      matter: String,
      blogimage: String

    },
    { timestamps: true })
);

module.exports = Blog;

