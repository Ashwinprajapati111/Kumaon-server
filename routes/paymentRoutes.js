<<<<<<< HEAD
const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
} = require("../controller/paymentController");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);


=======
const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
} = require("../controller/paymentController");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);


>>>>>>> da519bf15187260a85ab19c7b295e18769fb6202
module.exports = router;