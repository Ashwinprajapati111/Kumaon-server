module.exports = (app) => {
  const upload = require("../middleware/upload");
  const product = require("../controller/product.controller.js");
  var router = require("express").Router();
  const authJwt = require("../middleware/authMiddleware.js")


  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  router.post("/post", upload.fields([
    { name: "productimage", maxCount: 1 },
    { name: "productimages", maxCount: 10 },
    { name: "productbgimage", maxCount: 1 }
  ]), product.create);
  router.get("/getall", product.findAll);
  router.get("/getone/:id", product.findOne);
  router.put(
    "/update/:id",
    upload.fields([
      { name: "productimage", maxCount: 1 },
      { name: "productbgimage", maxCount: 1 },
      { name: "productimages", maxCount: 10 }
    ]),
    product.updateProduct
  );
  router.delete("/delete/:id", product.deleteProduct);
  app.use("/api", router);
};
