const express = require("express");
const router = express.Router();

const authController = require("../controller/admin.controller.js");
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

// Protected route example
router.get("/profile", authMiddleware, (req, res) => {

    res.json({
        message: "Welcome to protected profile",
        user: req.user
    });

});

module.exports = router;