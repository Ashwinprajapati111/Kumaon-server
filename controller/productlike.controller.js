<<<<<<< HEAD
const Product = require("../model/productlike.model.js");

// ✅ Share Product (TRACK EVERYTHING)
exports.shareProduct = async (req, res) => {
  try {
    const { productId, platform } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // increase share count
    product.shares += 1;

    // save history
    product.shareHistory.push({
      platform: platform || "unknown",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await product.save();

    res.json({
      success: true,
      shares: product.shares,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Like Product
exports.likeProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.likes += 1;
    await product.save();

    res.json({
      success: true,
      likes: product.likes,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
=======
const Product = require("../model/productlike.model.js");

// ✅ Share Product (TRACK EVERYTHING)
exports.shareProduct = async (req, res) => {
  try {
    const { productId, platform } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // increase share count
    product.shares += 1;

    // save history
    product.shareHistory.push({
      platform: platform || "unknown",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await product.save();

    res.json({
      success: true,
      shares: product.shares,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Like Product
exports.likeProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.likes += 1;
    await product.save();

    res.json({
      success: true,
      likes: product.likes,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
>>>>>>> da519bf15187260a85ab19c7b295e18769fb6202
};