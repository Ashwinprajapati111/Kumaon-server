const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// ================= CREATE USER / ADMIN =================
exports.create = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hash,
      role: role || "user",
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL USERS =================
exports.getAll = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET LOGGED-IN USER =================
// GET LOGGED-IN USER
exports.getMe = async (req, res) => {
  console.log("USERID from token:", req.userId);
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET SINGLE USER =================
exports.getOne = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid ID" });

  try {
    const user = await User.findById(id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE USER =================
exports.update = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) data.password = await bcrypt.hash(data.password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, data, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE USER =================
exports.delete = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ADD ADDRESS =================
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.addresses) user.addresses = [];

    const newAddress = {
      ...req.body,
      isDefault: false,
    };

    // ✅ If first address → make default
    if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    // ✅ If user selects "Set as default"
    if (req.body.isDefault) {
      // ❗ Remove default from ALL existing addresses
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });

      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);

    await user.save();

    res.json(user.addresses);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ADDRESSES =================
// GET ADDRESSES
exports.getAddresses = async (req, res) => {
  console.log("USERID from token:", req.userId);
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.addresses || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE ADDRESS =================
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses = user.addresses.filter(
      (a) => a._id.toString() !== req.params.id
    );
    await user.save();

    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SET DEFAULT ADDRESS =================
exports.setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const addressId = req.params.id;

    // ✅ Remove default from all
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });

    // ✅ Set selected one
    const selected = user.addresses.find(
      addr => addr._id.toString() === addressId
    );

    if (!selected) {
      return res.status(404).json({ message: "Address not found" });
    }

    selected.isDefault = true;

    await user.save();

    res.json({
      success: true,
      addresses: user.addresses,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SET LAST USED ADDRESS =================
exports.setLastUsedAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.addresses.forEach((a) => {
      a.lastUsed = a._id.toString() === req.params.id; // mark last-used
    });

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
