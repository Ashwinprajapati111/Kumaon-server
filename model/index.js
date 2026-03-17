
const dbconfig = require("../config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;



const db = {}

db.mongoose = mongoose;
db.url = dbconfig.url;
db.role = require("./role.model");
db.product = require("./product.model");
db.admin = require("./userModel.js");
db.order = require("./order.model.js");
db.contact = require("./contact.model.js");
db.blog = require("./blog.model");
db.slider = require("./slider.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;

module.exports =db;