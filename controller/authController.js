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

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};



// LOGIN
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        // check user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        // create token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};



// LOGOUT
exports.logout = async (req, res) => {

    res.json({
        message: "Logout successful"
    });

};

// forgot password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // Mail config
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "your@gmail.com",
            pass: "your_app_password"
        }
    });

    await transporter.sendMail({
        to: user.email,
        subject: "Password Reset",
        html: `<p>Click below to reset password:</p>
           <a href="${resetLink}">${resetLink}</a>`
    });

    res.json({ msg: "Reset link sent to email" });
};

// reset
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword; // ⚠️ hash in real app
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ msg: "Password updated successfully" });
};

exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // ✅ Save OTP in DB
        user.otp = otp;
        user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "rushibhagat111@gmail.com",
                pass: "zafjaemaxpfzburw"
            }
        });

        await transporter.sendMail({
            from: "yourgmail@gmail.com",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}`
        });

        res.json({ message: "OTP sent successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

// verify
exports.verifyOTPAndReset = async (req, res) => {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
        email,
        otp,
        otpExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ msg: "Password reset successful" });
};