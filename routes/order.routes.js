module.exports = (app) => {
  const order = require("../controller/order.controller.js");
  var router = require("express").Router();
  const authJwt = require("../middleware/authMiddleware.js")

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  router.post("/post",order.createOrder);
  router.get("/getall", order.getOrders);  
  router.delete("/delete/:id", order.deleteOrder);  
  app.use("/order", router);
};
