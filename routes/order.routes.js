const router = require("express").Router();
const orderController = require("../controller/order.controller");
const { verifyToken, isAdmin, isUser } = require("../middleware/authJwt");

// ❌ REMOVE create route (handled in payment)

// ✅ ADMIN - GET ALL ORDERS
router.get("/getall", verifyToken, isAdmin, orderController.getOrders);

// ✅ USER - GET MY ORDERS
router.get("/my", verifyToken, orderController.getMyOrders);

// ✅ GET SINGLE ORDER
router.get("/:id", verifyToken, orderController.getOrderById);

// ✅ DELETE ORDER (admin)
router.delete("/delete/:id", verifyToken, orderController.deleteOrder);
router.delete("/delete/:id", verifyToken, orderController.deleteOrder);
// ✅ UPDATE STATUS (admin)
router.put("/status/:id", verifyToken, isAdmin, orderController.updateOrderStatus);

// ✅ CANCEL ORDER (user)
router.put("/cancel/:id", verifyToken, orderController.cancelOrder);

// ✅ REPEAT ORDER
router.post("/repeat/:id", verifyToken, orderController.repeatOrder);


module.exports = router;