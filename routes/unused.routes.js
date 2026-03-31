const express = require("express");
const router = express.Router();

const unusedController = require("../controller/unused.controller");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

/* ================= ADMIN ONLY ================= */

router.post("/list", verifyToken, isAdmin, unusedController.listUnusedFiles);

router.post(
  "/delete-selected",
  verifyToken,
  isAdmin,
  unusedController.deleteSelectedFiles
);

router.post(
  "/delete-all",
  verifyToken,
  isAdmin,
  unusedController.deleteAllUnusedFiles
);

module.exports = router;