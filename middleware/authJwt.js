// middleware/authJWT.js
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: "No token" });

    if (token.startsWith("Bearer ")) token = token.slice(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    req.user = decoded;
    req.userId = decoded.id;
    req.role = decoded.role;

    console.log("✅ Token decoded:", decoded);

    next();
  } catch (err) {
    console.log("❌ JWT ERROR:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};

const isUser = (req, res, next) => {
  if (req.role === "admin") return next();
  if (!req.params.id) return next();
  if (mongoose.Types.ObjectId.isValid(req.params.id) && req.params.id === req.userId) return next();
  return res.status(403).json({ message: "Access denied" });
};

module.exports = { verifyToken, isAdmin, isUser };