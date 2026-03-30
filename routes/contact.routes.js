const router = require("express").Router();
const contact = require("../controller/contact.controller");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

// ✅ PUBLIC (submit contact)
router.post("/post", contact.create);

// ✅ ADMIN ONLY (view all contacts)
router.get("/getall", verifyToken, isAdmin, contact.findAll);

// ✅ ADMIN ONLY (delete contact)
router.delete("/delete/:id", verifyToken, isAdmin, contact.delete);

module.exports = router;