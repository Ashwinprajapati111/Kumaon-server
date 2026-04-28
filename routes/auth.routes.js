const router = require("express").Router();
const ctrl = require("../controller/auth.controller");

// Auth
router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

// OTP
router.post("/send-otp", ctrl.sendOTP);

// ✅ FIX: use OTP verification (NOT reset)
router.post("/verify-otp", ctrl.verifyOTP);
    

// ✅ NEW: separate reset password API
router.post("/reset-password", ctrl.resetPassword);

module.exports = router;