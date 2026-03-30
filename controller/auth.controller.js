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
      role: role || "user", // ✅ now works
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
exports.sendOTP = async (req, res) => {
  try {
    const { email, mobile } = req.body;

    if (!email && !mobile) {
      return res.status(400).json({ message: "Email or mobile required" });
    }

    const key = email || mobile;
    const otp = Math.floor(100000 + Math.random() * 900000);

    // store OTP
    otpStore[key] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 min
    };

    // send SMS
    if (mobile) {
      await sendSMS(mobile, otp);
    }

    // send Email
    if (email) {
      await sendEmail(email, otp);
    }

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ================= VERIFY OTP + RESET PASSWORD =================
exports.verifyOTPAndReset = async (req, res) => {
  try {
    const { email, mobile, otp, newPassword } = req.body;

    if (!otp || !newPassword || (!email && !mobile)) {
      return res.status(400).json({ message: "Missing data" });
    }

    const key = email || mobile;
    const record = otpStore[key];

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    // check expiry
    if (record.expires < Date.now()) {
      delete otpStore[key];
      return res.status(400).json({ message: "OTP expired" });
    }

    // check OTP
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

    // remove OTP after success
    delete otpStore[key];

    res.json({ message: "Password reset successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reset failed" });
  }
};