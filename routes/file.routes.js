const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");
const upload = require("../middleware/upload"); // multer instance

// ✅ Upload a single file (field name = 'file')
router.post("/upload", upload.single("file"), controller.upload);

// ✅ List all files
router.get("/files", controller.getListFiles);

// ✅ Download a file by name
router.get("/files/:name", controller.download);

module.exports = router;