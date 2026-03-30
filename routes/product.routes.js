const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const product = require("../controller/product.controller");

// ================= ROUTES =================

// CREATE PRODUCT
router.post(
  "/post",
  upload.fields([
    { name: "productimage", maxCount: 1 },
    { name: "productimages", maxCount: 10 },
    { name: "productbgimage", maxCount: 1 },
  ]),
  product.create
);

// GET ALL
router.get("/getall", product.findAll);

// GET ONE
router.get("/getone/:id", product.findOne);

// UPDATE
router.put(
  "/update/:id",
  upload.fields([
    { name: "productimage", maxCount: 1 },
    { name: "productbgimage", maxCount: 1 },
    { name: "productimages", maxCount: 10 },
  ]),
  product.updateProduct
);

// DELETE
router.delete("/delete/:id", product.deleteProduct);

module.exports = router;