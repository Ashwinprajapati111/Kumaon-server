const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
    createGallery,
    uploadImages,
    getAllGalleries,
    getGalleryById,
    updateGallery,
    deleteGallery,
    deleteImage
} = require("../controller/gallery.controller");

// CREATE
router.post("/create", upload.single("coverImage"), createGallery);

// UPLOAD IMAGES
router.post("/upload-images/:id", upload.array("images", 20), uploadImages);

// GET
router.get("/all", getAllGalleries);
router.get("/:id", getGalleryById);

// UPDATE


// DELETE IMAGE
router.put("/delete-image/:id", deleteImage);

// DELETE GALLERY
router.delete("/delete/:id", deleteGallery);

// update

router.put(
  "/update/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 20 }
  ]),
  updateGallery
);

module.exports = router;