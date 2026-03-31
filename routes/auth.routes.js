const router = require("express").Router();
const ctrl = require("../controller/auth.controller");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

router.post("/send-otp", ctrl.sendOTP);
router.post("/verify-otp", ctrl.verifyOTPAndReset);

module.exports = router;