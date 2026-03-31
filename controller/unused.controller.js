const fs = require("fs");
const path = require("path");

const Gallery = require("../model/gallery.model");
const Product = require("../model/product.model");
const Blog = require("../model/blog.model");
const Slider = require("../model/slider.model");

const UploadsDir = path.join(__dirname, "../uploads");

/* ================= DELETE FILE ================= */
const deleteFile = (file) => {
  try {
    const filePath = path.join(UploadsDir, file);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (err) {
    console.log("DELETE ERROR:", err.message);
  }
  return false;
};

/* ================= CLEAN FILE ================= */
const cleanFile = (file) => {
  if (!file) return null;
  return file.split("/").pop(); // remove URL if exists
};

/* ================= GET USED FILES ================= */
const getUsedFilesFromDB = async () => {
  let usedFiles = [];

  /* ===== GALLERY ===== */
  const galleries = await Gallery.find();

  galleries.forEach((g) => {
    if (g.coverImage) usedFiles.push(cleanFile(g.coverImage));

    if (g.photos?.length) {
      g.photos.forEach((img) => {
        if (img) usedFiles.push(cleanFile(img));
      });
    }
  });

  /* ===== PRODUCTS ===== */
  const products = await Product.find();

  products.forEach((p) => {
    if (p.productimage) usedFiles.push(cleanFile(p.productimage));

    if (p.productbgimage) usedFiles.push(cleanFile(p.productbgimage));

    if (p.productimages?.length) {
      p.productimages.forEach((img) => {
        if (img) usedFiles.push(cleanFile(img));
      });
    }
  });

  /* ===== BLOG (FIXED 🔥) ===== */
  const blogs = await Blog.find();

  blogs.forEach((b) => {
    if (b.blogimage) usedFiles.push(cleanFile(b.blogimage));
  });

  /* ===== SLIDER (FIXED 🔥) ===== */
  const sliders = await Slider.find();

  sliders.forEach((s) => {
    if (s.sliderimage) usedFiles.push(cleanFile(s.sliderimage));
  });

  const unique = [...new Set(usedFiles)];

  console.log("USED FILES:", unique.length);

  return unique;
};

/* ================= LIST UNUSED ================= */
exports.listUnusedFiles = async (req, res) => {
  try {
    const usedFiles = await getUsedFilesFromDB();

    if (!fs.existsSync(UploadsDir)) {
      return res.json({ success: true, unusedFiles: [] });
    }

    const allFiles = fs.readdirSync(UploadsDir);

    const unusedFiles = allFiles.filter(
      (file) => !usedFiles.includes(file)
    );

    console.log("TOTAL:", allFiles.length);
    console.log("USED:", usedFiles.length);
    console.log("UNUSED:", unusedFiles.length);

    res.json({
      success: true,
      total: allFiles.length,
      used: usedFiles.length,
      unusedFiles,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching unused files" });
  }
};

/* ================= DELETE SELECTED ================= */
exports.deleteSelectedFiles = (req, res) => {
  try {
    const { files } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files provided" });
    }

    const deletedFiles = [];

    files.forEach((file) => {
      if (deleteFile(file)) deletedFiles.push(file);
    });

    res.json({
      success: true,
      message: "Selected files deleted",
      deletedFiles,
    });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ================= DELETE ALL UNUSED ================= */
exports.deleteAllUnusedFiles = async (req, res) => {
  try {
    const usedFiles = await getUsedFilesFromDB();

    const allFiles = fs.readdirSync(UploadsDir);

    const unusedFiles = allFiles.filter(
      (file) => !usedFiles.includes(file)
    );

    const deletedFiles = [];

    unusedFiles.forEach((file) => {
      if (deleteFile(file)) deletedFiles.push(file);
    });

    res.json({
      success: true,
      message: "All unused files deleted",
      deletedFiles,
    });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};