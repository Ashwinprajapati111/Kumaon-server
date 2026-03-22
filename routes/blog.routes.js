const express = require("express");
const router = express.Router();

const blog = require("../controller/blog.controller.js");
const upload = require("../middleware/upload");

// CORS headers (optional)
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// CREATE BLOG
router.post(
  "/post",
  upload.fields([
    { name: "blogimage", maxCount: 1 }
  ]),
  blog.create
);

// UPDATE BLOG
router.put(
  "/update/:id",
  upload.single("blogimage"),
  blog.update
);

// GET ALL
router.get("/getall", blog.findAll);

// GET ONE
router.get("/get/:id", blog.findOne);

// DELETE
router.delete("/delete/:id", blog.delete);

module.exports = router;
