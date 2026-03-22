require("dotenv").config();

console.log("MONGO_URI CHECK:", process.env.MONGO_URI);

// Connect DB
require("./config/db.config");

const express = require("express");
const cors = require("cors");

const app = express();

// Base directory
global.__basedir = __dirname;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes imports
const paymentRoutes = require("./routes/paymentRoutes.js");
const authRoutes = require("./routes/authRoutes");

// Routes
require("./routes/file.routes.js")(app);
require("./routes/product.routes.js")(app);
require("./routes/contact.routes.js")(app);
require("./routes/order.routes.js")(app);
require("./routes/slider.routes.js")(app);
require("./routes/admin.routes.js")(app);

// ✅ blog router (new style)
app.use("/blog", require("./routes/blog.routes.js"));

// auth
app.use("/auth", authRoutes);

// payment
app.use("/api/payment", paymentRoutes);

// gallery
app.use("/api/gallery", require("./routes/gallery.routes.js"));

// Static files
app.use("/uploads", express.static("uploads"));

// Debug
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
