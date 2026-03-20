const db = require("../model");
const Blog = db.blog;
const path = require("path");
const fs = require("fs");

exports.create = async (req, res) => {
  try {

    // validation
    if (!req.body.title) {
      return res.status(400).send({
        message: "Title cannot be empty!"
      });
    }

    // image filename
    let blogimage = "";

    // get uploaded image safely
    if (req.files && req.files.blogimage && req.files.blogimage.length > 0) {
      blogimage = req.files.blogimage[0].filename;
    }

    // parse subtitle array
    let subtitles = [];

    if (req.body.subtitle) {
      try {
        subtitles = JSON.parse(req.body.subtitle);
      } catch (error) {
        return res.status(400).send({
          message: "Invalid subtitle format"
        });
      }
    }

    const blog = new Blog({
      title: req.body.title,
      subtitle: subtitles,
      blogimage: blogimage
    });

    const savedBlog = await blog.save();

    res.status(200).send(savedBlog);

  } catch (error) {
    res.status(500).send({
      message: error.message || "Error creating blog"
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Blog with id=${id}. Maybe Blog was not found!`
        });
      } else {
        res.send({
          message: "Blog was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Blog with id=" + id
      });
    });
};

exports.findAll = (req, res) => {
  Blog.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "some error occured while retriving product",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Blog.findById(id)
    .then((data) => {

      if (!data) {
        return res.status(404).send({
          message: `Blog not found with id=${id}`
        });
      }

      res.send(data);

    })
    .catch((err) => {

      res.status(500).send({
        message: "Error retrieving Slider with id=" + id
      });

    });
};

exports.update = async (req, res) => {
  try {

    const { title, subtitle, matter, removeImage } = req.body;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    // update title
    if (title) {
      blog.title = title;
    }

    // update subtitle array
    if (subtitle) {
      blog.subtitle = JSON.parse(subtitle);
    }

    // update matter
    if (matter) {
      blog.matter = matter;
    }

    // remove image
    if (removeImage === "true") {

      if (blog.blogimage) {

        const imagePath = path.join(
          __dirname,
          "../file/files/",
          blog.blogimage
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }

        blog.blogimage = null;
      }
    }

    // upload new image
    if (req.file) {

      // delete old image first
      if (blog.blogimage) {

        const oldImagePath = path.join(
          __dirname,
          "../file/files/",
          blog.blogimage
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      blog.blogimage = req.file.filename;
    }

    await blog.save();

    res.status(200).json({
      message: "Blog updated successfully",
      data: blog
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error updating blog",
      error: error.message
    });

  }
};