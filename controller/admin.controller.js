const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ check input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    // ✅ find user
    const user = await User.findOne({ email });

    // ❗ VERY IMPORTANT
    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // ✅ compare password safely
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    // ✅ success
    res.json({
      user,
      token: "dummy-token" // or JWT
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.json({
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Logout error",
      error: error.message
    });
  }
};