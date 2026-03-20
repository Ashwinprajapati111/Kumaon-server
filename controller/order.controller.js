const db = require("../model");
const Order = db.order;


/* ===========================
   CREATE ORDER
=========================== */

exports.createOrder = async (req, res) => {

    try {

        const newOrder = new Order(req.body);

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: "Order created successfully",
            order: savedOrder
        });

    } catch (error) {

        res.status(500).json({
            message: "Error creating order",
            error: error.message
        });

    }

};



// GET ALL ORDERS (Admin)
exports.getOrders = async (req, res) => {

    try {

        const orders = await Order.find().sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching orders"
        });

    }

};



// GET SINGLE ORDER
exports.getOrderById = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        res.json(order);

    } catch (error) {

        res.status(500).json({
            message: "Order not found"
        });

    }

};

exports.deleteOrder = async (req, res) => {

  try {

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};