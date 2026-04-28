const express = require("express");

const {
  createPrice,
  getAllPrices,
  getPriceById,
  updatePrice,
  deletePrice,
  updateGST,
  updateStateCharge
} = require("../controller/price.controller");

const router = express.Router();

// CREATE + READ
router.post("/", createPrice);
router.get("/", getAllPrices);
router.get("/:id", getPriceById);

// ✅ GENERAL UPDATE (optional full update)
router.put("/:id", updatePrice);

// ✅ GST ONLY UPDATE (FIXED ROUTE)
router.put("/:id/gst", updateGST);

// ✅ STATE UPDATE (FIXED ROUTE)
router.put("/:id/state", updateStateCharge);

// DELETE
router.delete("/:id", deletePrice);

module.exports = router;