module.exports = (app) => {
  const product = require("../controller/product.controller.js");
  var router = require("express").Router();
  const authJwt = require("../middleware/authJwt.js")

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  router.post("/post",product.create);
  router.get("/getall", product.findAll);  
  app.use("/api", router);
};
