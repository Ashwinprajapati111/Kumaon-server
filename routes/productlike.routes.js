const express = require("express");
const router = express.Router();
const productController = require("../controller/productlike.controller");

// ✅ LIKE
router.post("/like", productController.likeProduct);

// ✅ SHARE
router.post("/share", productController.shareProduct);

// ✅ GET SINGLE PRODUCT
router.get("/:id", productController.getProduct);

module.exports = router;