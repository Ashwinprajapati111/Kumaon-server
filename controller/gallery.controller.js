<<<<<<< HEAD
const Gallery = require("../model/gallery.model");

// ✅ CREATE GALLERY (title + cover)
exports.createGallery = async (req, res) => {
  try {
    const { title, eventDate } = req.body;

    // 🔥 DEBUG
    console.log("Incoming date:", eventDate);

    const gallery = new Gallery({
      title,
      eventDate: eventDate ? new Date(eventDate) : null, // ✅ FIX HERE
      coverImage: req.file?.filename,
      photos: []
    });

    await gallery.save();

    console.log("Saved date:", gallery.eventDate); // 🔥 DEBUG

    res.json({
      message: "Gallery created",
      galleryId: gallery._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create error" });
  }
};

// ✅ UPLOAD IMAGES
exports.uploadImages = async (req, res) => {
  try {
    const imagePaths = req.files.map(file => file.filename);

    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $push: { photos: { $each: imagePaths } } },
      { new: true }
    );

    res.json({ success: true, gallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL
exports.getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ _id: -1 });
    res.json(galleries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET SINGLE
exports.getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE TITLE / COVER


exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ message: "Not found" });
    }

    const { title, eventDate } = req.body;

    if (title) gallery.title = title;

    if (eventDate) {
      gallery.eventDate = new Date(eventDate);
    }

    // ✅ FIX COVER
    if (req.files && req.files.coverImage) {
      gallery.coverImage = req.files.coverImage[0].filename;
    }

    // ✅ FIX ADD NEW IMAGES
    if (req.files && req.files.images) {
      const newImages = req.files.images.map(file => file.filename);
      gallery.photos.push(...newImages);
    }

    await gallery.save();

    res.json({ message: "Updated", gallery });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update error" });
  }
};

// ✅ DELETE SINGLE IMAGE
exports.deleteImage = async (req, res) => {
  try {
    const { imageName } = req.body;

    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $pull: { photos: imageName } },
      { new: true }
    );

    res.json({ success: true, gallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE GALLERY
exports.deleteGallery = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Gallery deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
=======
const Gallery = require("../model/gallery.model");

// ✅ CREATE GALLERY (title + cover)
exports.createGallery = async (req, res) => {
  try {
    const { title, eventDate } = req.body;

    // 🔥 DEBUG
    console.log("Incoming date:", eventDate);

    const gallery = new Gallery({
      title,
      eventDate: eventDate ? new Date(eventDate) : null, // ✅ FIX HERE
      coverImage: req.file?.filename,
      photos: []
    });

    await gallery.save();

    console.log("Saved date:", gallery.eventDate); // 🔥 DEBUG

    res.json({
      message: "Gallery created",
      galleryId: gallery._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create error" });
  }
};

// ✅ UPLOAD IMAGES
exports.uploadImages = async (req, res) => {
  try {
    const imagePaths = req.files.map(file => file.filename);

    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $push: { photos: { $each: imagePaths } } },
      { new: true }
    );

    res.json({ success: true, gallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL
exports.getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ _id: -1 });
    res.json(galleries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET SINGLE
exports.getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE TITLE / COVER


exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ message: "Not found" });
    }

    const { title, eventDate } = req.body;

    if (title) gallery.title = title;

    if (eventDate) {
      gallery.eventDate = new Date(eventDate);
    }

    // ✅ FIX COVER
    if (req.files && req.files.coverImage) {
      gallery.coverImage = req.files.coverImage[0].filename;
    }

    // ✅ FIX ADD NEW IMAGES
    if (req.files && req.files.images) {
      const newImages = req.files.images.map(file => file.filename);
      gallery.photos.push(...newImages);
    }

    await gallery.save();

    res.json({ message: "Updated", gallery });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update error" });
  }
};

// ✅ DELETE SINGLE IMAGE
exports.deleteImage = async (req, res) => {
  try {
    const { imageName } = req.body;

    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $pull: { photos: imageName } },
      { new: true }
    );

    res.json({ success: true, gallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE GALLERY
exports.deleteGallery = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Gallery deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
>>>>>>> da519bf15187260a85ab19c7b295e18769fb6202
};