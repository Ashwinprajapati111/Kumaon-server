<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const productController = require("../controller/productlike.controller");

// ✅ LIKE
router.post("/like", productController.likeProduct);

// ✅ SHARE
router.post("/share", productController.shareProduct);

// ✅ GET SINGLE PRODUCT
router.get("/:id", productController.getProduct);

=======
const express = require("express");
const router = express.Router();
const productController = require("../controller/productlike.controller");

// ✅ LIKE
router.post("/like", productController.likeProduct);

// ✅ SHARE
router.post("/share", productController.shareProduct);

// ✅ GET SINGLE PRODUCT
router.get("/:id", productController.getProduct);

>>>>>>> da519bf15187260a85ab19c7b295e18769fb6202
module.exports = router;