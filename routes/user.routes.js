const router = require("express").Router();
const ctrl = require("../controller/user.controller");
const { verifyToken, isUser, isAdmin } = require("../middleware/authJwt");

// CREATE USER
router.post("/", ctrl.create);

// ADMIN ROUTES
router.get("/", verifyToken, isAdmin, ctrl.getAll);
router.get("/admins", verifyToken, isAdmin, ctrl.getAllAdmins);
router.get("/users", verifyToken, isAdmin, ctrl.getAllUsers);

// USER PROFILE / ADDRESS
router.get("/me", verifyToken, ctrl.getMe);
router.post("/address", verifyToken, ctrl.addAddress);
router.get("/address", verifyToken, ctrl.getAddresses);
router.delete("/address/:id", verifyToken, ctrl.deleteAddress);
router.put("/address/default/:id", verifyToken, ctrl.setDefaultAddress);
router.put("/address/:id/last-used", verifyToken, ctrl.setLastUsedAddress);

// SINGLE USER
router.get("/:id", verifyToken, isUser, ctrl.getOne);
router.put("/:id", verifyToken, isUser, ctrl.update);
router.delete("/:id", verifyToken, isAdmin, ctrl.delete);

module.exports = router;