const router = require("express").Router();
const insta = require("../controller/insta.controller");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

/* ================= PUBLIC ================= */

// 👉 Get all videos
router.get("/all", insta.getAllInsta);

// 👉 Get single video (SAFE ROUTE)
router.get("/get/:id", insta.getSingleInsta);


/* ================= ADMIN ================= */

// 👉 Create video
router.post("/create", verifyToken, isAdmin, insta.createInsta);

// 👉 Update video
router.put("/update/:id", verifyToken, isAdmin, insta.updateInsta);

// 👉 Delete video
router.delete("/delete/:id", verifyToken, isAdmin, insta.deleteInsta);


module.exports = router;