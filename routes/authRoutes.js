// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTPAndReset);

// Protected route: get current logged-in user
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Fetch user by ID attached by authMiddleware
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user data to frontend
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;