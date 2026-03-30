const Insta = require("../model/insta.model");
const mongoose = require("mongoose");

/* ================= CREATE VIDEO ================= */
exports.createInsta = async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ success: false, message: "Video URL is required" });
    }

    const newVideo = new Insta({ videoUrl });
    const saved = await newVideo.save();

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: saved,
    });

  } catch (error) {
    console.log("CREATE ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= GET ALL VIDEOS ================= */
exports.getAllInsta = async (req, res) => {
  try {
    const videos = await Insta.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });

  } catch (error) {
    console.log("FETCH ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= GET SINGLE VIDEO ================= */
exports.getSingleInsta = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ FIX: prevent "CastError: create"
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID",
      });
    }

    const video = await Insta.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      data: video,
    });

  } catch (error) {
    console.log("GET ONE ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= UPDATE VIDEO ================= */
exports.updateInsta = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoUrl } = req.body;

    // ✅ ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID",
      });
    }

    const updateData = {};
    if (videoUrl) updateData.videoUrl = videoUrl;

    const updated = await Insta.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      data: updated,
    });

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= DELETE VIDEO ================= */
exports.deleteInsta = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID",
      });
    }

    const deleted = await Insta.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });

  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};