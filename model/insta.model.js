const mongoose = require("mongoose");

const instaSchema = new mongoose.Schema(
    {
        videoUrl: {
            type: String,
            required: true, // Cloudinary / S3 / local path
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Insta", instaSchema);