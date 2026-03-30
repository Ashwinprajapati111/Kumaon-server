require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.config");

const app = express();

// ================= DEBUG ENV =================
console.log("MONGO_URI CHECK:", process.env.MONGO_URI ? "FOUND" : "MISSING");

// ================= GLOBAL BASE DIR =================
global.__basedir = __dirname;

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "*", // 🔒 Change in production
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================

// File uploads
app.use("/file", require("./routes/file.routes"));

// Auth & Users
app.use("/auth", require("./routes/auth.routes"));
app.use("/user", require("./routes/user.routes"));
app.use("/admin", require("./routes/admin.routes"));


// Slider (✅ FIXED)
app.use("/slider", require("./routes/slider.routes.js"));
app.use("/contact", require("./routes/contact.routes"));

// Blog
app.use("/blog", require("./routes/blog.routes"));

// Products (✅ FIXED PATH)
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/orders", require("./routes/order.routes"));

// Other APIs
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/gallery", require("./routes/gallery.routes"));

const instaRoutes = require("./routes/insta.routes");

app.use("/api/insta", instaRoutes);

// Static uploads
app.use("/uploads", express.static("uploads"));

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ================= NODE ERROR HANDLING =================
process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED PROMISE REJECTION:", err);
  process.exit(1);
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();