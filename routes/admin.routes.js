const router = require("express").Router();
const ctrl = require("../controller/user.controller");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

router.get("/", verifyToken, isAdmin, ctrl.getAll);
router.get("/:id", verifyToken, isAdmin, ctrl.getOne);
router.put("/:id", verifyToken, isAdmin, ctrl.update);
router.delete("/:id", verifyToken, isAdmin, ctrl.delete);

module.exports = router;