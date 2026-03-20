const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      email: String,
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      phone: String
    },

    cart: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String
      }
    ],

    payment: {
      method: {
        type: String,
        enum: ["COD", "UPI", "Card", "NetBanking"],
        default: "COD"
      },
      paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
      }
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
      ],
      default: "Pending"
    },

    totalAmount: {
      type: Number,
      required: false
    },
    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

module.exports = mongoose.model("Order", OrderSchema);