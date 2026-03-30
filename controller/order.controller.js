const db = require("../model");
const Order = db.order;

/* ===========================
   CREATE ORDER
=========================== */


/* ===========================
   GET ALL ORDERS (Admin)
=========================== */
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        console.error("GET ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Error fetching orders",
        });
    }
};


/* ===========================
   GET SINGLE ORDER
=========================== */
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.error("GET ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Error fetching order",
        });
    }
};


/* ===========================
   DELETE ORDER
=========================== */
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });

    } catch (error) {
        console.error("DELETE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Error deleting order",
        });
    }
};

/* ===========================
   UPDATE ORDER STATUS
=========================== */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order.orderStatus = orderStatus;

        const updatedOrder = await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated",
            order: updatedOrder,
        });

    } catch (error) {
        console.error("UPDATE STATUS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Error updating order status",
        });
    }
};

exports.getMyOrders = async (req, res) => {
    try {

        const userId =
            req.user.id ||
            req.user._id ||
            req.user.userId;

        const orders = await Order.find({
            user: userId,
        }).sort({ createdAt: -1 });

        res.json(orders);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message,
        });

    }
};

/* ===========================
   CANCEL ORDER (USER)
=========================== */
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const userId =
            req.user.id ||
            req.user._id ||
            req.user.userId;

        // 🔒 Ownership check
        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not allowed",
            });
        }

        // ❌ Restrict cancel
        if (
            ["Shipped", "Out for Delivery", "Delivered"].includes(
                order.orderStatus
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled now",
            });
        }

        // 💰 Optional: prevent cancel if paid
        if (order.payment?.paymentStatus === "Paid") {
            return res.status(400).json({
                success: false,
                message: "Paid order cannot be cancelled",
            });
        }

        order.orderStatus = "Cancelled";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order,
        });

    } catch (error) {
        console.error("CANCEL ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Error cancelling order",
        });
    }
};

/* ===========================
   REPEAT ORDER
=========================== */
exports.repeatOrder = async (req, res) => {
    try {

        const oldOrder = await Order.findById(req.params.id);

        if (!oldOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const userId =
            req.user.id ||
            req.user._id ||
            req.user.userId;

        // 🔒 Ownership check
        if (oldOrder.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not allowed",
            });
        }

        // 🔁 Recalculate totals (better than copy)
        const subtotal = oldOrder.cart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        const shipping = oldOrder.shipping || 0;
        const tax = oldOrder.tax || 0;
        const total = subtotal + shipping + tax;

        // 🔁 Create new order
        const newOrder = new Order({

            user: userId,

            customer: oldOrder.customer,

            cart: oldOrder.cart,

            subtotal,
            shipping,
            tax,
            total,

            payment: {
                method: oldOrder.payment?.method || "COD",
                paymentStatus: "Pending", // reset payment
            },

            orderStatus: "Pending",
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order repeated successfully",
            order: savedOrder,
        });

    } catch (error) {
        console.error("REPEAT ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Error repeating order",
        });
    }
};