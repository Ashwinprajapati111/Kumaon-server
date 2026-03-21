<<<<<<< HEAD
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    password: String
}, { timestamps: true });

=======
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    password: String
}, { timestamps: true });

>>>>>>> da519bf15187260a85ab19c7b295e18769fb6202
module.exports = mongoose.model("Admin", adminSchema);