module.exports = (app) => {
  const blog = require("../controller/blog.controller.js");
  var router = require("express").Router();
  const authJwt = require("../middleware/authMiddleware.js")
  const multer = require('multer')
  const upload = require("../middleware/upload");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  router.post("/post", upload.fields([
    { name: "blogimage", maxCount: 1 }
  ]), blog.create);
  // UPDATE BLOG
  router.put(
    "/update/:id",
    upload.single("blogimage"),
    blog.update
  );
  router.get("/getall", blog.findAll);
  router.get("/get/:id", blog.findOne);
  router.delete("/delete/:id", blog.delete);
  app.use("/blog", router);
};
