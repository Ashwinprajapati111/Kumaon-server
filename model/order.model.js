const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customer: {
      email: String,
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      state: String,      // ✅ ADD
      country: String,    // ✅ ADD
      pincode: String,
      phone: String,
    },

    cart: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    // ✅ Razorpay Payment Info
    payment: {
      method: {
        type: String,
        enum: ["COD", "UPI", "Card", "NetBanking"],
        default: "UPI",
      },
      paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
      },
      paymentId: String,          // ✅ razorpay_payment_id
      razorpayOrderId: String,    // ✅ razorpay_order_id
    },

    // ✅ Order Tracking
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,

  },
  { timestamps: true } // ✅ auto createdAt & updatedAt
);

module.exports = mongoose.model("Order", OrderSchema);