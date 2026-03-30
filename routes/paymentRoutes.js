const router = require("express").Router();
const { verifyToken } = require("../middleware/authJwt");
const paymentController = require("../controller/paymentController");

// Create Razorpay order
router.post("/create-order", verifyToken, paymentController.createOrder);

// Verify payment & save order
router.post("/verify-payment", verifyToken, paymentController.verifyPayment);

module.exports = router;