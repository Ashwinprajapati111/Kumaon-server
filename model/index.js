
const dbconfig = require("../config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;



const db = {}

db.mongoose = mongoose;
db.url = dbconfig.url;
db.user = require("./user.model");
db.role = require("./role.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;

module.exports =db;