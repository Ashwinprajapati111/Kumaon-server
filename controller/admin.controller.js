const db = require("../model");
const Admin = db.admin;
const bcrypt = require("bcrypt");


// ✅ CREATE
exports.create = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        // 🔥 CHECK EXISTING USER
        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // 🔐 HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            name,
            email,
            mobile,
            password: hashedPassword
        });

        await newAdmin.save();

        res.status(201).json({
            message: "Admin created successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


// ✅ LOGIN
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // 🔥 REMOVE PASSWORD BEFORE SENDING
        const userData = admin.toObject();
        delete userData.password;

        res.status(200).json({
            message: "Login successful",
            user: userData
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


// ✅ GET ALL (HIDE PASSWORD)
exports.findAll = async (req, res) => {
    try {
        const data = await Admin.find().select("-password"); // 🔥 hide password
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


// ✅ GET ONE (HIDE PASSWORD)
exports.findOne = async (req, res) => {
    try {
        const data = await Admin.findById(req.params.id).select("-password");

        if (!data) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send(data);

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


// ✅ UPDATE (IMPORTANT FIX)
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = { ...req.body };

        // 🔐 HASH PASSWORD IF UPDATED
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updated = await Admin.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select("-password");

        if (!updated) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send(updated);

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


// ✅ DELETE
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Admin.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send({ message: "Deleted successfully" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};