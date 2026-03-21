const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  res.json({ message: "Logout successful" });
};

// PROFILE (for Dashboard)
exports.profile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    const user = await User.findById(decoded.id).select("name email role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: "your@gmail.com", pass: "your_app_password" }
  });

  await transporter.sendMail({
    to: user.email,
    subject: "Password Reset",
    html: `<p>Click below to reset password:</p><a href="${resetLink}">${resetLink}</a>`
  });

  res.json({ msg: "Reset link sent to email" });
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();
  res.json({ msg: "Password updated successfully" });
};

// SEND OTP
exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: "rushibhagat111@gmail.com", pass: "zafjaemaxpfzburw" }
  });

  await transporter.sendMail({
    from: "yourgmail@gmail.com",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}`
  });

  res.json({ message: "OTP sent successfully" });
};

// VERIFY OTP AND RESET
exports.verifyOTPAndReset = async (req, res) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({
    email,
    otp,
    otpExpire: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ msg: "Invalid OTP" });

  user.password = await bcrypt.hash(password, 10);
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  res.json({ msg: "Password reset successful" });
};