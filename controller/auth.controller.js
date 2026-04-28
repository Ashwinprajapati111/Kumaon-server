const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpStore = require("../config/otpStore");
const sendSMS = require("../config/msg91");
const sendEmail = require("../config/mailer");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    if (!name || !password || (!email && !mobile)) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exist = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      mobile,
      password: hash,
      role: role || "user",
    });

    res.json({ message: "Registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if ((!email && !mobile) || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const data = user.toObject();
    delete data.password;

    res.json({
      message: "Login successful",
      token,
      user: data,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= SEND OTP =================
// ================= SEND OTP =================
exports.sendOTP = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    email = email.toString().trim().toLowerCase();

    // ✅ Check user exists
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") }
    });

    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    await sendEmail(email, otp);

    console.log("OTP STORED:", email, otp);

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ================= VERIFY OTP (ONLY - FOR CHECKOUT) =================
exports.verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;

    console.log("BODY:", req.body); // 🔥 DEBUG

    if (!email || !otp) {
      return res.status(400).json({ message: "Missing data" });
    }

    email = email.toString().trim().toLowerCase();
    otp = otp.toString().trim();

    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.expires < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    delete otpStore[email];

    return res.json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { email, mobile, otp, newPassword } = req.body;

    if (!otp || !newPassword || (!email && !mobile)) {
      return res.status(400).json({ message: "Missing data" });
    }

    // ✅ FIX: normalize key
    const key = (email || mobile).toString().trim().toLowerCase();

    const record = otpStore[key];

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.expires < Date.now()) {
      delete otpStore[key];
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    user.password = hash;
    await user.save();

    delete otpStore[key];

    res.json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ message: "Reset failed" });
  }
};