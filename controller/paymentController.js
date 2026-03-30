const razorpay = require("../config/razorpay.js");
const crypto = require("crypto");
const Order = require("../model/order.model"); // ✅ import your Order model

// ✅ Create Order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount, // ₹ → paise
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Verify Payment and Save Order
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cart,
      customer,
      subtotal,
      shipping = 0,
      tax = 0,
      total,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // ✅ prevent duplicate
    const existingOrder = await Order.findOne({
      "payment.paymentId": razorpay_payment_id,
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Order already exists",
      });
    }

    const order = new Order({
      user: req.user?.id || req.user?._id,
      customer,
      cart,
      subtotal,
      shipping,
      tax,
      total,
      payment: {
        method: "UPI",
        paymentStatus: "Paid",
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
      orderStatus: "Confirmed",
    });

    await order.save();

    res.json({
      success: true,
      message: "Payment verified & order saved",
      orderId: razorpay_order_id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
