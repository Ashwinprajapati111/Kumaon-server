// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    // Attach user info to request
    req.user = { id: decoded.id, role: decoded.role };

    next(); // continue to route handler
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    // Handle token errors specifically
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    res.status(500).json({ message: "Server error in auth middleware" });
  }
};

module.exports = authMiddleware;