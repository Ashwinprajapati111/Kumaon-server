const express = require("express");
const cors = require("cors");
const app = express();

const paymentRoutes = require("./routes/paymentRoutes.js");
const authRoutes = require("./routes/authRoutes");

var corsOptions = {
  origin: "http://localhost:3000"
};

global.__basedir = __dirname;

// DB
const db = require("./model");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to the database!"))
  .catch(err => {
    console.log("Cannot connect to DB", err);
    process.exit();
  });

// MIDDLEWARE
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
require("./routes/file.routes.js")(app);
require("./routes/product.routes.js")(app);
require("./routes/contact.routes.js")(app);
require("./routes/order.routes.js")(app);
require("./routes/blog.routes.js")(app);
require("./routes/slider.routes.js")(app);
require("./routes/admin.routes.js")(app);

app.use("/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Gallery routes
app.use("/uploads", express.static("uploads"));
app.use("/api/gallery", require("./routes/gallery.routes.js"));

// productlike and share
// const productRoutes = require("./routes/productlike.routes.js");
// app.use("/api/products", productRoutes);
// DEBUG
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ${PORT}`);
});